'use client';
import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import Link from "next/link";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { useGetStaticsQuery, useDeleteStaticMutation } from "@/store/backendSlice/staticAPISlice";
const PAGE_STORAGE_KEY = 'current_page_name';
const PAGINATION_PREFIX = 'pagination_';
import { usePagePermission } from "../usePagePermission";

const getStorageKey = (pathname) => {
  const [path] = pathname.split('?');
  const match = path.match(/\/chanderpur-admin\/(manage-[^\/]+|addupd-[^\/]+)/);
  if (match) {
    const pageIdentifier = match[1];
    const normalizedKey = pageIdentifier.replace('addupd-', 'manage-');
    return `${PAGINATION_PREFIX}${normalizedKey}`;
  }
  return null;
};


export default function ManageStaticData() {
  const router = useRouter();
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000, });
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const { data: staticData = [], isLoading, isError } = useGetStaticsQuery();
  const pagePermission = usePagePermission(checkData);


  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const storageKey = getStorageKey(currentPath);
      if (storageKey) {
        const stored = localStorage.getItem(storageKey);
        return stored ? parseInt(stored, 10) : 10;
      }
    }
    return 10;
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const currentStorageKey = getStorageKey(currentPath);
      if (currentStorageKey) {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(PAGINATION_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
        localStorage.setItem(PAGE_STORAGE_KEY, currentStorageKey);
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const storageKey = getStorageKey(currentPath);
        if (!storageKey) {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith(PAGINATION_PREFIX) || key === PAGE_STORAGE_KEY) {
              localStorage.removeItem(key);
            }
          });
        }
      }
    };
  }, []);

  const handlePerRowsChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const storageKey = getStorageKey(currentPath);
      if (storageKey) {
        localStorage.setItem(storageKey, newPerPage.toString());
      }
    }
  };

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (checkData?.loggedIn && pagePermission && pagePermission.CanRead !== 1) {
      toast.error("You do not have permission to view this page");
      router.push("/chanderpur-admin/dashboard");
    }
  }, [checkData, pagePermission, router]);

  const columns = [
    {
      name: "S.No Name",
      sortable: true,
      cell: (row) =>
        isLoading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton circle width={40} height={40} />
            <Skeleton width={200} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="user-image-none">{row.SerialNo}</div>
            {row.StaticName}
          </div>
        ),
      width: "85%",
    },
    {
      name: "Date",
      selector: (row) => row.PostedDate,
      cell: (row) => (isLoading ? <Skeleton width={100} /> : row.PostedDate),
      width: "110px",
    },
    ...(pagePermission?.CanWrite === 1
      ? [
        {
          name: "Action",
          cell: (row) =>
            isLoading ? (
              <Skeleton circle width={24} height={24} />
            ) : (
              <Link
                href={`/chanderpur-admin/addupd-page?ID=${row.StaticID}`}
                className="edit-icon"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                  <g fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M13.198 1.22L3.12 11.298a1 1 0 0 0-.282.555l-.705 4.594a1 1 0 0 0 1.14 1.14l4.595-.705a1 1 0 0 0 .555-.281L18.501 6.523a1 1 0 0 0 0-1.414l-3.89-3.89a1 1 0 0 0-1.413 0M4.317 15.404l.448-2.924l9.14-9.14l2.475 2.476l-9.14 9.14z"
                      clipRule="evenodd"
                    />
                    <path d="m11.442 5.247l1.06-1.061l3.242 3.24l-1.061 1.061z" />
                  </g>
                </svg>
              </Link>
            ),
          width: "90px",
        },
      ]
      : []),
  ];

  const filteredData = useMemo(() => {
    return (staticData || []).filter((item) => {
      const searchText = filterText.toLowerCase();
      const fullName = item.StaticName?.toLowerCase() || "";
      const matchesText = fullName.includes(searchText);
      const matchesOption =
        !selectedOption || item.ActiveStatus.toString() === selectedOption;
      return matchesText && matchesOption;
    });
  }, [staticData, filterText, selectedOption]);

  const subHeaderComponent = (
    <div className="subheader-container">
      <div className="colA">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="dropdown"
          style={{ display: "none" }}
        >
          <option value="">Select Status</option>
          <option value="1">Active</option>
          <option value="0">In Active</option>
        </select>
        <input
          type="text"
          placeholder="Search Keywords"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="searchinput"
        />
      </div>

      <div className="colB">
        <Link
          href={"/chanderpur-admin/addupd-page"}
          className="addnew-btn"
          style={{ width: "110px" }}
        >
          <span>+</span> Add New
        </Link>
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
        title="Manage Static Data"
        columns={columns}
        data={filteredData}
        striped
        pagination
        highlightOnHover
        selectableRowsHighlight
        subHeader
        progressPending={isLoading}
        progressComponent={< SkeletonLoader />}
        subHeaderComponent={subHeaderComponent}
        paginationRowsPerPageOptions={[10, 30, 50, 100]}
        paginationPerPage={rowsPerPage}
        onChangeRowsPerPage={handlePerRowsChange}
        subHeaderWrap
        responsive
      />
    </main>
  );
}
