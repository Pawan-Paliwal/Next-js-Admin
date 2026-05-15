'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from "react-redux";
import Link from "next/link";
import toast from "react-hot-toast";
import { useGetPhotosByGalleryIdQuery, useSaveGalleryPhotosMutation, useDeleteGalleryPhotoMutation, useGetAllGalleryQuery } from "@/store/backendSlice/galleryAPISlice";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { usePagePermission } from "../usePagePermission";

export default function ManagePhotos() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const galleryID = searchParams.get("GalleryID");

  const [isUploading, setIsUploading] = useState(false);
  const adminUserName = useSelector((state) => state.adminAuth?.adminUser?.UserFullName) || "Admin";

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = isAuthCheckSuccess && checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: galleryData } = useGetAllGalleryQuery(undefined, { skip: !galleryID });
  const selectedGallery = useMemo(() => {
    return galleryData?.data?.find(g => g.galleryID === parseInt(galleryID));
  }, [galleryData, galleryID]);

  const { data: photoData, refetch, isLoading: isPhotosLoading } = useGetPhotosByGalleryIdQuery(galleryID, { skip: !galleryID, refetchOnMountOrArgChange: true });

  const [savePhotos] = useSaveGalleryPhotosMutation();
  const [deletePhoto] = useDeleteGalleryPhotoMutation();

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) router.push("/chanderpur-admin/login");
    if (!galleryID) router.push("/chanderpur-admin/manage-gallery");
  }, [isAuthCheckSuccess, checkData, router, galleryID]);

  useEffect(() => {
    if (isPermissionsReady && !pagePermission.isLoading && pagePermission.CanRead !== 1) {
      toast.error("You do not have permission to view this page");
      router.push("/chanderpur-admin/dashboard");
    }
  }, [isPermissionsReady, pagePermission, router]);

  const handleDelete = useCallback(async (ids) => {
    if (!ids?.length) return toast.error("No items selected");
    if (!confirm(`Are you sure you want to delete ${ids.length > 1 ? ids.length + ' photos' : 'this photo'}?`)) return;

    try {
      for (const id of ids) {
        await deletePhoto(id).unwrap();
      }
      toast.success(`${ids.length} photo(s) deleted.`);
      await refetch();
    } catch (error) {
      toast.error("Deletion failed.");
    }
  }, [deletePhoto, refetch]);

  const handleBulkUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsUploading(true);

    const slug = selectedGallery?.galleryTitle?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'photo';
    const uploadData = new FormData();
    uploadData.append("galleryID", galleryID);
    uploadData.append("updatedBy", adminUserName);

    const existingCount = photoData?.data?.length || 0;
    files.forEach((file, index) => {
      const ext = file.name.split('.').pop();
      const newFileName = `${slug}-${existingCount + index + 1}.${ext}`;
      const newFile = new File([file], newFileName, { type: file.type });
      uploadData.append("photoImages", newFile);
    });

    try {
      const res = await savePhotos(uploadData).unwrap();
      if (res.success) {
        toast.success(res.message);
        await refetch();
      } else {
        toast.error(res.message || "Upload failed.");
      }
    } catch (err) {
      toast.error("An error occurred during upload.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };


  if (isPhotosLoading) return <div className="p-10 text-center">Loading Gallery Photos...</div>;

  return (
    <main className="container-fluid" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', backgroundColor: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#0D4741' }}>Manage Gallery Photos</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
            Album: <span style={{ color: '#F48120', fontWeight: '600' }}>{selectedGallery?.galleryTitle || "..."} ({photoData?.data?.length || 0} Photos)</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {(pagePermission?.CanAdd === 1 || checkData?.user?.Role === "Super Admin") && (
            <>
              <input type="file" multiple accept="image/*" id="bulk-upload" style={{ display: 'none' }} onChange={handleBulkUpload} disabled={isUploading} />
              <label htmlFor="bulk-upload" style={{ backgroundColor: '#0D4741', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                {isUploading ? "Uploading..." : "Add Photos"}
              </label>
            </>
          )}

          <Link href="/chanderpur-admin/manage-gallery" style={{ backgroundColor: '#f8f9fa', color: '#444', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            Back
          </Link>
        </div>
      </div>

      {photoData?.data?.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {photoData.data.map((photo) => {
            return (
              <div
                key={photo.photoID}
                style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', background: '#fff' }}
              >
                <div style={{ position: 'relative', paddingTop: '75%' }}>
                  <img
                    src={`/OnlineImages/GalleryImages/${photo.photoImage}`}
                    alt="Gallery Photo"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = "/icon/stbg.svg"; }}
                  />
                </div>
                {(pagePermission?.CanDelete === 1 || checkData?.user?.Role === "Super Admin") && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete([photo.photoID]); }}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(220, 38, 38, 0.9)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                      title="Delete Photo"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🖼️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>No photos found</h3>
          <p style={{ color: '#666', marginBottom: '25px', textAlign: 'center' }}>This album is currently empty. Start by adding some beautiful photos.</p>
          {(pagePermission?.CanAdd === 1 || checkData?.user?.Role === "Super Admin") && (
            <label htmlFor="bulk-upload" style={{ backgroundColor: '#0D4741', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
              Choose Files to Upload
            </label>
          )}
        </div>
      )}
    </main>
  );
}
