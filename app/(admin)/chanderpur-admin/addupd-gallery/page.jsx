'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { usePagePermission } from "../usePagePermission";
import { useSaveOrUpdateGalleryMutation, useGetAllGalleryQuery, useDeleteGalleryMutation } from "@/store/backendSlice/galleryAPISlice";
import { validateFields } from "@/utils/validateFields";

const thStyle = { padding: "8px", border: "1px solid #ddd", background: "#f1f1f1", textAlign: "left", fontSize: '13px', fontWeight: '600' };
const tdStyle = { padding: "8px", border: "1px solid #ddd", fontSize: '13px' };

export default function AddUpdGallery() {
  const router = useRouter();
  const [activeVideo, setActiveVideo] = useState(null);
  const searchParams = useSearchParams();
  const galleryID = searchParams.get("ID");
  const adminUserName = useSelector((state) => state.adminAuth?.adminUser?.UserFullName) || "Admin";

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = isAuthCheckSuccess && checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: galleryResponse, isSuccess, isLoading: isFetching, refetch } = useGetAllGalleryQuery(undefined, { refetchOnMountOrArgChange: true });

  const [saveOrUpdate, { isLoading: isSaving }] = useSaveOrUpdateGalleryMutation();
  const [deleteGallery] = useDeleteGalleryMutation();

  const [formData, setFormData] = useState({
    galleryTitle: "",
    galleryImage: "",
    galleryVideoURL: "",
    activeStatus: 1,
  });

  const [formErrors, setFormErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) router.push("/chanderpur-admin/login");
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady && !pagePermission.isLoading) {
      if (galleryID ? pagePermission.CanWrite !== 1 : pagePermission.CanAdd !== 1) {
        toast.error(`You do not have permission to ${galleryID ? "update" : "add"} records.`);
        router.push("/chanderpur-admin/dashboard");
      }
    }
  }, [isPermissionsReady, pagePermission, galleryID, router]);

  useEffect(() => {
    if (galleryID && isSuccess && galleryResponse?.data) {
      const item = galleryResponse.data.find(i => i.galleryID === parseInt(galleryID));
      if (item) {
        setFormData({
          galleryTitle: item.galleryTitle || "",
          galleryImage: item.galleryImage || "",
          galleryVideoURL: item.galleryVideoURL || "",
          activeStatus: item.activeStatus ?? 1,
        });
        if (item.galleryImage) {
          setPreview(`/OnlineImages/GalleryImages/${item.galleryImage}`);
        }
      }
    }
  }, [galleryID, isSuccess, galleryResponse]);

  const handleInput = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const slug = formData.galleryTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'gallery';
    const newFileName = `${slug}-cover.${ext}`;
    const newFile = new File([file], newFileName, { type: file.type });
    setSelectedFile(newFile);
    setPreview(URL.createObjectURL(newFile));
    if (formErrors.galleryImage) setFormErrors(prev => ({ ...prev, galleryImage: "" }));
  };

  const handleSubmit = async () => {
    const rules = {
      galleryTitle: { required: true, requiredMessage: "Title is required" },
    };
    if (!galleryID && !selectedFile) {
      rules.galleryImage = { required: true, requiredMessage: "Cover Image is required" };
    }
    const errors = validateFields(formData, rules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const uploadData = new FormData();
    if (galleryID) uploadData.append("galleryID", galleryID);
    uploadData.append("galleryTitle", formData.galleryTitle);
    uploadData.append("galleryVideoURL", formData.galleryVideoURL);
    uploadData.append("galleryType", formData.galleryVideoURL ? "Video" : "Image");
    uploadData.append("activeStatus", formData.activeStatus);
    uploadData.append("updatedBy", adminUserName);
    if (selectedFile) {
      uploadData.append("galleryImage", selectedFile);
    }
    try {
      const res = await saveOrUpdate(uploadData).unwrap();
      if (res.success) {
        toast.success(res.message);
        if (!galleryID) {
          setFormData({ galleryTitle: "", galleryImage: "", galleryVideoURL: "", activeStatus: 1 });
          setPreview(null);
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          router.push("/chanderpur-admin/manage-gallery");
        }
        refetch();
      } else {
        toast.error(res.message || "Operation failed.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteGallery(id).unwrap();
      if (res.success) {
        toast.success("Deleted successfully");
        refetch();
      }
    } catch (err) {
      toast.error("Error deleting item");
    }
  };

  const getAutoplayUrl = (url) => {
    if (!url) return "";
    let finalUrl = url;
    if (finalUrl.includes("youtube.com/watch?v=")) {
      const videoId = finalUrl.split("v=")[1]?.split("&")[0];
      finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (finalUrl.includes("youtu.be/")) {
      const videoId = finalUrl.split("youtu.be/")[1]?.split("?")[0];
      finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (finalUrl.includes("youtube.com/embed/")) {
      finalUrl += finalUrl.includes("?") ? "&autoplay=1" : "?autoplay=1";
    }
    return finalUrl;
  };


  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h2 style={{ fontWeight: 700, marginBottom: '20px' }}>
          {galleryID ? "Update" : "Add New"} Gallery Item
        </h2>
        <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #e5e5e5", borderRadius: "12px", background: "#fff", boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Title*</label>
              <input
                type="text"
                placeholder="e.g. Workshop"
                value={formData.galleryTitle}
                onChange={e => handleInput("galleryTitle", e.target.value)}
                className={formErrors.galleryTitle ? "error-input" : ""}
                style={{ padding: '10px 12px', borderRadius: '8px' }}
              />
              {formErrors.galleryTitle && <p className="error" style={{ fontSize: '11px', marginTop: '4px' }}>{formErrors.galleryTitle}</p>}
            </div>

            <div className="form-group" style={{ flex: '1 1 250px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Gallery Image (Cover)*</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className={formErrors.galleryImage ? "error-input" : ""}
                  style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
                {preview && (
                  <div style={{ position: 'relative', width: '45px', height: '45px' }}>
                    <img src={preview} alt="Preview" width={45} height={45} style={{ borderRadius: "8px", objectFit: 'cover', border: "1px solid #eee" }} />
                  </div>
                )}
              </div>
              {formErrors.galleryImage && <p className="error" style={{ fontSize: '11px', marginTop: '4px' }}>{formErrors.galleryImage}</p>}
            </div>

            <div className="form-group" style={{ flex: '1 1 250px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Video URL (Optional)</label>
              <input
                type="text"
                placeholder="https://youtube.com/..."
                value={formData.galleryVideoURL}
                onChange={e => handleInput("galleryVideoURL", e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '8px' }}
              />
            </div>

            <div style={{ paddingTop: '22px' }}>
              {(galleryID ? pagePermission?.CanWrite === 1 : pagePermission?.CanAdd === 1) && (
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  style={{ margin: 0, padding: '10px 25px', backgroundColor: '#0D4741', color: '#fff', fontSize: '14px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  {isSaving ? "Saving..." : (galleryID ? "Update Item" : "+ Add Item")}
                </button>
              )}
            </div>
          </div>
        </div>
        {!galleryID && galleryResponse?.data?.length > 0 && (
          <div style={{ marginTop: '20px', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: "40%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: '60px' }}>#</th>
                  <th style={{ ...thStyle, width: '120px' }}>Preview</th>
                  <th style={thStyle}>Title</th>
                  <th style={{ ...thStyle, width: '100px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {galleryResponse.data.map((item, index) => (
                  <tr key={item.galleryID}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>
                      <div
                        onClick={() => item.galleryType === "Video" && setActiveVideo(item.galleryVideoURL)}
                        style={{ position: 'relative', width: '60px', height: '40px', cursor: item.galleryType === "Video" ? 'pointer' : 'default', borderRadius: '4px', overflow: 'hidden' }}
                      >
                        <img
                          src={`/OnlineImages/GalleryImages/${item.galleryImage}`}
                          alt="gallery"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.src = "/icon/stbg.svg"; }}
                        />
                        {item.galleryType === "Video" && (
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={tdStyle}>{item.galleryTitle} (Type: {item.galleryType})</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Link href={`?ID=${item.galleryID}`} style={{ color: '#0D4741', fontWeight: '600', textDecoration: 'none' }}>Edit</Link>
                        {pagePermission?.CanDelete === 1 && (
                          <button onClick={() => handleDelete(item.galleryID)} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: '600' }}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", marginTop: "30px" }}>
          <Link href="/chanderpur-admin/manage-gallery" style={{ backgroundColor: '#f5f5f5', color: '#444', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            Back to list
          </Link>
        </div>
      </div>

      {/* Video Popup */}
      {activeVideo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}>
            <button
              onClick={() => setActiveVideo(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>
            <iframe
              src={getAutoplayUrl(activeVideo)}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </main>
  );
}
