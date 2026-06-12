'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import Link from "next/link";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { useGetCategorysQuery, useDeleteCategoryMutation, useUpdateCategoryStatusMutation, useUpdateDisplayOrderMutation } from "@/store/backendSlice/categoryAPISlice";
import CategorySkeleton from "@/components/backendcomponents/listskeleton";
import { usePagePermission } from "../usePagePermission";

export default function ManageCategoryData() {
  const router = useRouter();
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });
  const pagePermission = usePagePermission(checkData);
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [displayOrders, setDisplayOrders] = useState({});
  const { data: categoryData = [], refetch, isLoading } = useGetCategorysQuery();
  const categorys = categoryData || [];
  const [updateDisplayOrder] = useUpdateDisplayOrderMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateStatus] = useUpdateCategoryStatusMutation();

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

  useEffect(() => {
    if (Array.isArray(categorys)) {
      const initialOrders = {};
      categorys.forEach(s => {
        initialOrders[s.CategoryID] = s.DisplayOrder;
      });
      setDisplayOrders(initialOrders);
    }
  }, [categorys]);

  const handleDelete = async (CategoryID) => {
    if (pagePermission?.CanDelete !== 1) {
      toast.error("You do not have permission to delete categories");
      return;
    }
    const confirmed = confirm("Are you sure you want to delete this category post?");
    if (!confirmed) return;
    try {
      const res = await deleteCategory(CategoryID).unwrap();
      if (res.success) {
        toast.success("Category deleted successfully");
        refetch();
      } else {
        toast.error("Error deleting category.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDisplayOrderChange = (CategoryID, value) => {
    setDisplayOrders(prev => ({
      ...prev,
      [CategoryID]: value === "" ? "" : parseInt(value, 10)
    }));
  };

  const handleUpdateDisplayOrder = async () => {
    if (pagePermission?.CanWrite !== 1) {
      toast.error("You do not have permission to update display order");
      return;
    }
    const confirmed = confirm("Are you sure you want to update the display orders?");
    if (!confirmed) return;
    const data = Object.entries(displayOrders).map(([CategoryID, DisplayOrder]) => ({
      CategoryID,
      DisplayOrder
    }));
    try {
      const res = await updateDisplayOrder(data).unwrap();
      toast.success(res?.message || "Display order updated successfully");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating display order.");
    }
  };

  const handleApprove = async (CategoryID, currentStatus) => {
    if (pagePermission?.CanWrite !== 1) {
      toast.error("You do not have permission to update status");
      return;
    }
    const confirmed = confirm("Are you sure you want to update this status?");
    if (!confirmed) return;
    try {
      const updatedStatus = currentStatus === 1 ? 0 : 1;
      const res = await updateStatus({ CategoryID, ActiveStatus: updatedStatus }).unwrap();
      if (res.success) {
        toast.success("Status updated successfully");
        refetch();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  const calculateTitleWidth = () => {
    let totalOtherColumnsWidth = 150;
    if (pagePermission?.CanWrite === 1) {
      totalOtherColumnsWidth += 130;
      totalOtherColumnsWidth += 80;
    }

    if (pagePermission?.CanDelete === 1) {
      totalOtherColumnsWidth += 80;
    }

    return `calc(100% - ${totalOtherColumnsWidth}px)`;
  };


  const columns = [
    {
      name: "Title",
      selector: (row) => row.CategoryName,
      sortable: true,
      cell: (row) =>
        isLoading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton circle width={40} height={40} />
            <Skeleton width={200} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {row.CategoryImage ? (
              <img
                src={`/OnlineImages/CategoryImages/${row.CategoryImage}`}
                alt={row.CategoryName}
                className="user-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="user-image-none">{row.SerialNo}</div>
            )}
            <span>{row.CategoryName}</span>
          </div>
        ),
      width: calculateTitleWidth()
    },
    ...(pagePermission?.CanWrite === 1
      ? [
        {
          name: "Display Order",
          selector: (row) => row.DisplayOrder,
          cell: (row) => (
            <input
              type="number"
              value={displayOrders[row.CategoryID] !== undefined ? displayOrders[row.CategoryID] : ""}
              onChange={(e) => handleDisplayOrderChange(row.CategoryID, e.target.value)}
              className="form-control"
              style={{ width: "65px", textAlign: "center" }}
            />
          ),
          sortable: true,
          width: "130px",
        },
      ]
      : []),
    {
      name: "Status",
      cell: (row) =>
        isLoading ? (
          <Skeleton width={80} />
        ) : (
          <>
            <span style={{ color: row.ActiveStatus ? "green" : "red" }}>
              {row.ActiveStatus ? "Active" : "Inactive"}
            </span>
            {pagePermission?.CanWrite === 1 && (
              <button
                className="approve-btn"
                style={{ color: row.ActiveStatus ? "red" : "green", marginLeft: "8px" }}
                onClick={() => handleApprove(row.CategoryID, row.ActiveStatus)}
              >
                {row.ActiveStatus ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15l-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152l2.758 3.15a1.2 1.2 0 0 1 0 1.698" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z" />
                  </svg>
                )}
              </button>
            )}
          </>
        ),
      width: "150px",
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
                href={`/afford-admin/addupd-category?ID=${row.CategoryID}`}
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
          width: "80px",
        },
      ]
      : []),
    ...(pagePermission?.CanDelete === 1
      ? [
        {
          name: "Delete",
          cell: (row) =>
            isLoading ? (
              <Skeleton circle width={24} height={24} />
            ) : (
              <button onClick={() => handleDelete(row.CategoryID)} className="edit-icon">
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


  const filteredData = categorys.filter((item) => {
    const searchText = filterText.toLowerCase();
    const matchesText = item.CategoryName?.toLowerCase().includes(searchText);
    const matchesOption =
      !selectedOption || item.ActiveStatus.toString() === selectedOption;
    return matchesText && matchesOption;
  });

  const subHeaderComponent = (
    <div className="subheader-container">
      <div className="colA">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="dropdown"
        >
          <option value="">Select Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
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
        {pagePermission?.CanWrite === 1 && (
          <button className="update-display" onClick={handleUpdateDisplayOrder}>
            Update Display
          </button>
        )}
        {pagePermission?.CanAdd === 1 && (
          <Link
            href={"/afford-admin/addupd-category"}
            className="addnew-btn"
            style={{ width: "110px" }}
          >
            <span>+</span> Add New
          </Link>
        )}
      </div>
    </div>
  );

  const SkeletonLoader = () => (
    <div>
      {[...Array(10)].map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  );

  // Show loading while checking permissions
  if (!checkData) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <DataTable
        title="Manage Category Data"
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
    </main>
  );
}