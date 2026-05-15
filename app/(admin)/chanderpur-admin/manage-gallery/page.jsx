'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import Link from "next/link";
import toast from "react-hot-toast";
import { useGetAllGalleryQuery, useDeleteGalleryMutation, useUpdateGalleryStatusMutation } from "@/store/backendSlice/galleryAPISlice";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { usePagePermission } from "../usePagePermission";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";

const customStyles = {
  header: { style: { minHeight: '56px' } },
  headRow: { style: { borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: '#f1f1f1' } },
  rows: { style: { minHeight: '45px', paddingTop: '9px', paddingBottom: '9px' } },
  noData: { style: { padding: '28px', textAlign: 'center' } },
  contextMenu: { style: { display: 'none' } },
};

export default function ManageGallery() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });

  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = isAuthCheckSuccess && checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: galleryData, refetch, isLoading, isFetching, isError } = useGetAllGalleryQuery(undefined, { refetchOnMountOrArgChange: true });

  const [deleteGallery] = useDeleteGalleryMutation();
  const [updateStatus] = useUpdateGalleryStatusMutation();

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) router.push("/chanderpur-admin/login");
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady && !pagePermission.isLoading && pagePermission.CanRead !== 1) {
      toast.error("You do not have permission to view this page");
      router.push("/chanderpur-admin/dashboard");
    }
  }, [isPermissionsReady, pagePermission, router]);

  const handleDelete = useCallback(async (rows) => {
    if (!rows?.length) return toast.error("No items selected");
    if (!confirm(`Are you sure you want to delete ${rows.length > 1 ? rows.length + ' items' : 'this item'}?`)) return;
    try {
      for (const row of rows) {
        const res = await deleteGallery(row.galleryID).unwrap();
        if (!res.success) {
          toast.error(res.message || "Delete failed");
          break;
        }
      }
      toast.success("Deleted successfully");
      refetch();
    } catch (error) {
      console.error("Action error:", error);
      toast.error("An unexpected error occurred.");
    }
  }, [deleteGallery, refetch]);

  const handleStatusChange = async (row) => {
    try {
      const res = await updateStatus({ galleryID: row.galleryID, activeStatus: row.activeStatus === 1 ? 0 : 1 }).unwrap();
      if (res.success) {
        toast.success(res.message);
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Status update failed");
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

  const columns = useMemo(() => [
    {
      name: "Gallery Information",
      selector: (row) => row.galleryTitle,
      sortable: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            onClick={() => row.galleryType === "Video" && setActiveVideo(row.galleryVideoURL)}
            style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', cursor: row.galleryType === "Video" ? 'pointer' : 'default', border: '1px solid #eee' }}
          >
            <img
              src={`/OnlineImages/GalleryImages/${row.galleryImage}`}
              alt={"Img"}
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = "/icon/stbg.svg";
              }}
            />
            {row.galleryType === "Video" && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600 }}>{row.galleryTitle || "Untitled"}</span>
            <small style={{ color: '#666' }}>Type: {row.galleryType}</small>
          </div>
        </div>
      ),
      width: "73%",
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          onClick={() => pagePermission?.CanWrite === 1 && handleStatusChange(row)}
          style={{ color: row.activeStatus ? "green" : "red", cursor: pagePermission?.CanWrite === 1 ? 'pointer' : 'default', fontWeight: '500' }}
        >
          {row.activeStatus ? "Active" : "Inactive"}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Manage Media",
      cell: (row) => (
        row.galleryType === "Image" ? (
          <Link href={`/chanderpur-admin/manage-photos?GalleryID=${row.galleryID}`} style={{ color: '#F48120', fontWeight: 'bold', fontSize: '12px', border: '1px solid #F48120', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Add Photos
          </Link>
        ) : (
          <button
            onClick={() => setActiveVideo(row.galleryVideoURL)}
            style={{ color: '#007bff', background: 'none', border: '1px solid #007bff', fontWeight: 'bold', fontSize: '12px', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            Play Video
          </button>
        )
      ),
      width: "150px"
    },
    ...(pagePermission?.CanWrite === 1 || pagePermission?.CanDelete === 1 ? [
      {
        name: "Action",
        cell: (row) => (
          <div style={{ display: "flex", gap: "10px" }}>
            {pagePermission?.CanWrite === 1 && (
              <Link href={`/chanderpur-admin/addupd-gallery?ID=${row.galleryID}`} className="edit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><g fill="currentColor">
                  <path fillRule="evenodd" d="M13.198 1.22L3.12 11.298a1 1 0 0 0-.282.555l-.705 4.594a1 1 0 0 0 1.14 1.14l4.595-.705a1 1 0 0 0 .555-.281L18.501 6.523a1 1 0 0 0 0-1.414l-3.89-3.89a1 1 0 0 0-1.413 0M4.317 15.404l.448-2.924l9.14-9.14l2.475 2.476l-9.14 9.14z" clipRule="evenodd" /><path d="m11.442 5.247l1.06-1.061l3.242 3.24l-1.061 1.061z" /></g></svg>
              </Link>
            )}
            {pagePermission?.CanDelete === 1 && (
              <button onClick={() => handleDelete([row])} className="edit-icon" style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            )}
          </div>
        ),
        width: "120px",
      }
    ] : [])
  ], [handleDelete, pagePermission, handleStatusChange]);

  const filteredData = useMemo(() => {
    if (isError || !galleryData?.success || !galleryData?.data) return [];
    return galleryData.data.filter(item => {
      const searchText = filterText.toLowerCase();
      const matchesText = item.galleryTitle?.toLowerCase().includes(searchText);
      const matchesStatus = !selectedOption || item.activeStatus.toString() === selectedOption;
      return matchesText && matchesStatus;
    });
  }, [galleryData, filterText, selectedOption, isError]);

  const subHeaderComponent = useMemo(() => (
    <div className="subheader-container">
      <div className="colA">
        <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="dropdown">
          <option value="">Select Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        <input type="text" placeholder="Search Gallery" value={filterText} onChange={(e) => setFilterText(e.target.value)} className="searchinput" />
      </div>
      <div className="colB">
        {pagePermission?.CanAdd === 1 && (
          <Link href={"/chanderpur-admin/addupd-gallery"} className="addnew-btn" style={{ width: "110px", textDecoration: 'none' }}><span>+</span> Add New</Link>
        )}
      </div>
    </div>
  ), [filterText, pagePermission]);

  return (
    <main style={{ position: 'relative' }}>
      <DataTable
        title="Manage Gallery"
        columns={columns}
        data={filteredData}
        striped
        pagination
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        highlightOnHover
        subHeader
        subHeaderComponent={subHeaderComponent}
        progressPending={isLoading || isFetching}
        progressComponent={<div>{[...Array(5)].map((_, i) => <ServiceSkeleton key={i} />)}</div>}
        customStyles={customStyles}
        noDataComponent={
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            {!isLoading && !isFetching && (isError ? "No record found" : (galleryData?.message || "No record found"))}
          </div>
        }
      />

      {/* Inline Video Popup */}
      {activeVideo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <button
              onClick={() => setActiveVideo(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
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
