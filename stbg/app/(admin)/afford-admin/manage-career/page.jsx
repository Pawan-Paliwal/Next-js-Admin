'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import {
  useFetchCareerEnquiriesQuery,
  useDeleteCareerEnquiryMutation
} from "@/store/backendSlice/careerEnquiryApi";
import { usePagePermission } from "../usePagePermission";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";

export default function ManageCareerData() {
  const router = useRouter();
  const { data: career = [], isLoading, error } = useFetchCareerEnquiriesQuery(undefined);
  const careers = career;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [displayOrders, setDisplayOrders] = useState({});
  const [deleteCareer] = useDeleteCareerEnquiryMutation();
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });
  const pagePermission = usePagePermission(checkData);

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/afford-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (checkData?.loggedIn && pagePermission && pagePermission.CanRead !== 1) {
      toast.error("You do not have permission to view this page");
      router.push("/afford-admin/dashboard");
    }
  }, [checkData, pagePermission, router]);

  const handleDelete = async (CareerID) => {
    if (!confirm("Are you sure you want to delete this Career?")) return;
    try {
      const res = await deleteCareer(CareerID).unwrap();
      toast.success(res.data?.message || "Career deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete Career");
    }
  };

  const handleDownload = async (resumeFile) => {
    const url = `${apiUrl}/ApiImages/Career/${resumeFile}`;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = resumeFile;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const filteredData = Array.isArray(careers)
    ? careers.filter((item) => {
      const searchText = filterText.toLowerCase();
      const fullName = item.FullName?.toLowerCase() || "";
      const email = item.EmailID?.toLowerCase() || "";
      const phone = item.PhoneNo?.toLowerCase() || "";
      const jobCategory = item.JobCategoryID?.toString().toLowerCase() || "";
      const message = item.Message?.toLowerCase() || "";
      const matchesText =
        fullName.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText) ||
        jobCategory.includes(searchText) ||
        message.includes(searchText);

      return matchesText;
    })
    : [];

  const openMessagePopup = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.FullName,
      sortable: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="user-image-none">{row.SerialNo}</div>
          <span>{row.FullName}</span>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.EmailID,
      sortable: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{row.EmailID}</span>
        </div>
      ),
    },
    {
      name: "Phone Number",
      selector: (row) => row.PhoneNo,
      sortable: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{row.PhoneNo}</span>
        </div>
      ),
    },
    {
      name: "Job",
      selector: (row) => row.JobCategoryID,
      sortable: true,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{row.JobCategoryID}</span>
        </div>
      ),
    },
    {
      name: "Resume",
      selector: (row) => (typeof row.Resume === "string" ? row.Resume : ""),
      sortable: false,
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {row.Resume && typeof row.Resume === "string" ? (
            <button
              onClick={() => handleDownload(row.Resume)}
              style={{ cursor: "pointer", background: "none", border: "none" }}
              title="Download Resume"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 16l4-5h-3V4h-2v7H8l4 5zm-7 4h14v2H5v-2z" />
              </svg>
            </button>
          ) : (
            <span>No Resume</span>
          )}
        </div>
      ),
    },
    {
      name: "Posted Date",
      selector: (row) => row.PostedDate,
      sortable: true,
      cell: (row) => {
        const date = new Date(row.PostedDate);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>{`${formattedDate} ${formattedTime}`}</span>
          </div>
        );
      },
    },
    {
      name: "Message",
      selector: (row) => row.Message,
      sortable: true,
      cell: (row) => (
        <button onClick={() => openMessagePopup(row)} className="message-btn">
          Show
        </button>
      ),
    },
    ...(pagePermission?.CanDelete === 1
      ? [
        {
          name: "Delete",
          cell: (row) => (
            <button onClick={() => handleDelete(row.CareerID)} className="edit-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
                />
              </svg>
            </button>
          ),
          width: "80px",
        },
      ]
      : []),
  ];

  const subHeaderComponent = (
    <div className="subheader-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <div className="colA">

        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="dropdown"
        >
          <option value="">All Enquiry Types</option>
          {Array.from(new Set(careers.map((c) => c.JobCategoryID))).map(
            (type) => (
              <option key={type} value={type}>
                {type}
              </option>
            )
          )}
        </select>
        <input
          type="text"
          placeholder="Search Keywords"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="searchinput"
        />
      </div>
    </div>
  );

  const SkeletonLoader = () => (
    <div>
      {[...Array(10)].map((_, i) => (
        <ServiceSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <main>
      <DataTable
        title="Manage Career Data"
        columns={columns}
        data={filteredData}
        striped
        pagination
        highlightOnHover
        selectableRowsHighlight
        subHeader
        subHeaderComponent={subHeaderComponent}
        paginationRowsPerPageOptions={[10, 30, 50, 100]}
        subHeaderWrap
        progressPending={isLoading}
        progressComponent={<SkeletonLoader />}
        responsive
      />
      {isPopupOpen && selectedUser && (
        <div className="popup-overlay manage_user_pop">
          <div className="popup-box" style={{ height: "auto" }}>
            <button className="close-btn" onClick={() => setIsPopupOpen(false)}>×</button>
            <h2>Career Details</h2>
            <div style={{ marginBottom: "1rem" }}>
              <p><strong>Name:</strong> {selectedUser.FullName}</p>
              <p><strong>Email:</strong> {selectedUser.EmailID}</p>
              <p><strong>Phone:</strong> {selectedUser.PhoneNo}</p>
              <p><strong>Posted Date:</strong> {new Date(selectedUser.PostedDate).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
