'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import Link from "next/link";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { useGetCaseStudiesQuery, useDeleteCaseStudyMutation, useUpdateCaseStudyStatusMutation } from "@/store/backendSlice/caseStudyApiSlice";
import { useGetActiveProductsQuery } from "@/store/backendSlice/productAPISlice";
import { usePagePermission } from "../usePagePermission";

const PAGE_STORAGE_KEY = 'current_page_name';
const PAGINATION_PREFIX = 'pagination_';

const getStorageKey = (pathname) => {
    const [path] = pathname.split('?');
    const match = path.match(/\/afford-admin\/(manage-[^\/]+|addupd-[^\/]+)/);
    if (match) {
        const pageIdentifier = match[1];
        const normalizedKey = pageIdentifier.replace('addupd-', 'manage-');
        return `${PAGINATION_PREFIX}${normalizedKey}`;
    }
    return null;
};

const getFileType = (filename) => {
    if (!filename) return 'image';
    const ext = filename.split('.').pop().toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov'].includes(ext) ? 'video' : 'image';
};

export default function ManageCaseStudies() {
    const router = useRouter();
    const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 10000,
    });
    const pagePermission = usePagePermission(checkData);

    const [filterText, setFilterText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");

    const { data: caseStudyResponse, refetch, isLoading } = useGetCaseStudiesQuery();
    const [updateStatus] = useUpdateCaseStudyStatusMutation();
    const { data: productResponse } = useGetActiveProductsQuery();
    const [deleteCaseStudy] = useDeleteCaseStudyMutation();
    const caseStudyData = Array.isArray(caseStudyResponse)
        ? caseStudyResponse
        : (caseStudyResponse?.data || []);

    const usedProducts = Array.from(
        new Map(
            caseStudyData
                .filter(i => i.ProductId && i.ParentProductName)
                .map(i => [
                    i.ProductId,
                    {
                        ProductId: i.ProductId,
                        ProductName: i.ParentProductName
                    }
                ])
        ).values()
    );


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
        if (checkData?.loggedIn && pagePermission && pagePermission.CanRead !== 1) {
            toast.error("You do not have permission to view this page");
            router.push("/afford-admin/dashboard");
        }
    }, [checkData, pagePermission, router]);

    const handleDelete = async (CaseStudyId) => {
        if (pagePermission?.CanDelete !== 1) {
            toast.error("You do not have permission to delete case study");
            return;
        }
        const confirmed = confirm("Are you sure you want to delete this case study?");
        if (!confirmed) return;
        try {
            const res = await deleteCaseStudy(CaseStudyId).unwrap();
            if (res.success) {
                toast.success("Case Study deleted successfully");
                refetch();
            } else {
                toast.error("Error deleting case study.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
        }
    };

    const handleApprove = async (CaseStudyId, currentStatus) => {
        if (pagePermission?.CanWrite !== 1) {
            toast.error("You do not have permission to update status");
            return;
        }
        const confirmed = confirm("Are you sure you want to update this status?");
        if (!confirmed) return;
        try {
            const updatedStatus = currentStatus === 1 ? 0 : 1;
            const res = await updateStatus({ CaseStudyId, ActiveStatus: updatedStatus }).unwrap();

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


    const columns = [
        {
            name: "Case Study Name",
            selector: (row) => row.CaseStudyName,
            sortable: true,
            cell: (row) =>
                isLoading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Skeleton circle width={40} height={40} />
                        <Skeleton width={200} />
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {row.CaseStudyImage ? (
                            getFileType(row.CaseStudyImage) === 'video' ? (
                                <video
                                    src={`/OnlineImages/CasestudiesImages/${row.CaseStudyImage}`}
                                    className="user-image"
                                    style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = "none";
                                    }}
                                />
                            ) : (
                                <img
                                    src={`/OnlineImages/CasestudiesImages/${row.CaseStudyImage}`}
                                    alt={row.CaseStudyName}
                                    className="user-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = "none";
                                    }}
                                />
                            )
                        ) : (
                            <div className="user-image-none">{row.SerialNo}</div>
                        )}
                        <span>{row.CaseStudyName}</span>
                    </div>
                ),
            width: "72%",
        },
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
                                onClick={() => handleApprove(row.CaseStudyId, row.ActiveStatus)}
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
        {
            name: "Date",
            selector: (row) => row.CreatedAt,
            cell: (row) => (isLoading ? <Skeleton width={100} /> : row.CreatedAt),
            width: "120px",
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
                                href={`/afford-admin/addupd-casestudy?ID=${row.CaseStudyId}`}
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
                            <button onClick={() => handleDelete(row.CaseStudyId)} className="edit-icon">
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

    const filteredData = caseStudyData.filter((item) => {
        const searchText = filterText.toLowerCase();
        const matchesText = item.CaseStudyName?.toLowerCase().includes(searchText);
        const matchesStatus = !selectedStatus || item.ActiveStatus.toString() === selectedStatus;
        const matchesProduct = !selectedProduct || item.ProductId?.toString() === selectedProduct;

        return matchesText && matchesStatus && matchesProduct;
    });

    const subHeaderComponent = (
        <div className="subheader-container">
            <div className="colA">
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="dropdown">
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>
                {/* <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="dropdown"
                >
                    <option value="">Select Product</option>
                    {usedProducts.map((product) => (
                        <option key={product.ProductId} value={product.ProductId}>
                            {product.ProductName}
                        </option>
                    ))}
                </select> */}
                <input
                    type="text"
                    placeholder="Search Case Studies"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="searchinput"
                />
            </div>
            <div className="colB">
                {pagePermission?.CanAdd === 1 && (
                    <Link href={"/afford-admin/addupd-casestudy"} className="addnew-btn" style={{ width: "110px" }}>
                        <span>+</span> Add New
                    </Link>
                )}

            </div>
        </div>
    );

    return (
        <main>
            <DataTable
                title="Manage Case Studies"
                columns={columns}
                data={filteredData}
                striped
                pagination
                highlightOnHover
                selectableRowsHighlight
                subHeader
                subHeaderComponent={subHeaderComponent}
                paginationRowsPerPageOptions={[10, 30, 50, 100]}
                paginationPerPage={rowsPerPage}
                onChangeRowsPerPage={handlePerRowsChange}
                subHeaderWrap
                progressPending={isLoading}
                responsive
            />
        </main>
    );
}