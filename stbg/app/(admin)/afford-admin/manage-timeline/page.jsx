'use client';
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import Link from "next/link";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { useDeleteTimelineMutation, useUpdateTimelineStatusMutation, useUpdateDisplayOrderMutation } from "@/store/backendSlice/timelineAPISlice";
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";

export default function ManageTimelineData() {
    const router = useRouter();
    const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 10000,
    });
    const [filterText, setFilterText] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [displayOrders, setDisplayOrders] = useState({});
    const [timelineData, setTimelineData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isInitialized = useRef(false);

    const [deleteTimeline] = useDeleteTimelineMutation();
    const [updateStatus] = useUpdateTimelineStatusMutation();
    const [updateDisplayOrder] = useUpdateDisplayOrderMutation();

    const fetchTimelines = async () => {
        setIsLoading(true);
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            if (authHeader) {
                headers['Authorization'] = authHeader;
            }
            const response = await fetch(`${apiUrl}/timeline/all-timeline`, {
                method: 'GET',
                headers: headers,
            });
            const result = await response.json();
            if (result.success) {
                setTimelineData(result.data || []);
            } else {
                toast.error("Failed to fetch timelines");
                setTimelineData([]);
            }
        } catch (error) {
            console.error("Error fetching timelines:", error);
            toast.error("Error loading timelines");
            setTimelineData([]);
        } finally {
            setIsLoading(false);
        }
    };

    

    useEffect(() => {
        if (isSuccess && !checkData?.loggedIn) {
            router.push("/afford-admin/login");
        }
    }, [isSuccess, checkData, router]);

    useEffect(() => {
        fetchTimelines();
    }, []);

    useEffect(() => {
        if (Array.isArray(timelineData) && timelineData.length > 0) {
            const needsUpdate = !isInitialized.current ||
                timelineData.some(timeline => !(timeline.TimelineID in displayOrders));
            if (needsUpdate) {
                const initialOrders = {};
                timelineData.forEach(timeline => {
                    initialOrders[timeline.TimelineID] =
                        displayOrders[timeline.TimelineID] !== undefined
                            ? displayOrders[timeline.TimelineID]
                            : timeline.DisplayOrder;
                });
                setDisplayOrders(initialOrders);
                isInitialized.current = true;
            }
        }
    }, [timelineData.length, displayOrders]);

    const handleDelete = async (TimelineID) => {
        const confirmed = confirm("Are you sure you want to delete this timeline?");
        if (!confirmed) return;
        try {
            const res = await deleteTimeline(TimelineID).unwrap();
            if (res.success) {
                toast.success("Timeline deleted successfully");
                isInitialized.current = false;
                fetchTimelines();
            } else {
                toast.error("Error deleting timeline");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        }
    };

    const handleApprove = async (TimelineID, currentStatus) => {
        const confirmed = confirm("Are you sure you want to update this status?");
        if (!confirmed) return;
        try {
            const updatedStatus = currentStatus === 1 ? 0 : 1;
            const res = await updateStatus({ TimelineID, ActiveStatus: updatedStatus }).unwrap();
            if (res.success) {
                toast.success("Status updated successfully");
                fetchTimelines();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating status");
        }
    };

    const handleUpdateDisplayOrder = async () => {
        const confirmed = confirm("Are you sure you want to update the display orders?");
        if (!confirmed) return;
        const data = Object.entries(displayOrders).map(([TimelineID, DisplayOrder]) => ({
            TimelineID: Number(TimelineID),
            DisplayOrder: Number(DisplayOrder)
        }));
        try {
            const res = await updateDisplayOrder(data).unwrap();
            toast.success(res?.message || "Display order updated successfully");
            isInitialized.current = false;
            fetchTimelines();
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while updating display order");
        }
    };

    const handleDisplayOrderChange = (TimelineID, value) => {
        setDisplayOrders(prev => ({
            ...prev,
            [TimelineID]: value === "" ? "" : parseInt(value, 10)
        }));
    };

    const columns = [
        {
            name: "Title",
            selector: (row) => row.TimelineName,
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
                        <span>{row.TimelineName}</span>
                    </div>
                ),
            width: "68%",
        },
        {
            name: "Display Order",
            selector: (row) => row.DisplayOrder,
            cell: (row) =>
                isLoading ? (
                    <Skeleton width={60} />
                ) : (
                    <input
                        type="number"
                        value={displayOrders[row.TimelineID] !== undefined ? displayOrders[row.TimelineID] : ""}
                        onChange={(e) => handleDisplayOrderChange(row.TimelineID, e.target.value)}
                        className="form-control"
                        style={{ width: "70px", textAlign: "center" }}
                    />
                ),
            sortable: true,
            width: "150px",
        },
        {
            name: "Status",
            cell: (row) =>
                isLoading ? (
                    <Skeleton width={80} />
                ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: row.ActiveStatus ? "green" : "red" }}>
                            {row.ActiveStatus ? "Active" : "Inactive"}
                        </span>
                        <button
                            className="approve-btn"
                            style={{ color: row.ActiveStatus ? "red" : "green" }}
                            onClick={() => handleApprove(row.TimelineID, row.ActiveStatus)}
                        >
                            {row.ActiveStatus ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15l-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152l2.758 3.15a1.2 1.2 0 0 1 0 1.698" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z" />
                                </svg>
                            )}
                        </button>
                    </div>
                ),
            width: "150px",
        },
        {
            name: "Action",
            cell: (row) =>
                isLoading ? (
                    <Skeleton circle width={24} height={24} />
                ) : (
                    <Link href={`/afford-admin/addupd-timeline?ID=${row.TimelineID}`} className="edit-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                            <g fill="currentColor">
                                <path fillRule="evenodd" d="M13.198 1.22L3.12 11.298a1 1 0 0 0-.282.555l-.705 4.594a1 1 0 0 0 1.14 1.14l4.595-.705a1 1 0 0 0 .555-.281L18.501 6.523a1 1 0 0 0 0-1.414l-3.89-3.89a1 1 0 0 0-1.413 0M4.317 15.404l.448-2.924l9.14-9.14l2.475 2.476l-9.14 9.14z" clipRule="evenodd" />
                                <path d="m11.442 5.247l1.06-1.061l3.242 3.24l-1.061 1.061z" />
                            </g>
                        </svg>
                    </Link>
                ),
            width: "90px",
        },
        {
            name: "Delete",
            cell: (row) =>
                isLoading ? (
                    <Skeleton circle width={24} height={24} />
                ) : (
                    <button onClick={() => handleDelete(row.TimelineID)} className="edit-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" />
                        </svg>
                    </button>
                ),
            width: "80px",
        },
    ];

    const filteredData = timelineData.filter((item) => {
        const searchText = filterText.toLowerCase();
        const matchesText =
            item.TimelineName?.toLowerCase().includes(searchText) ||
            item.TimelineNameURL?.toLowerCase().includes(searchText);
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
                    placeholder="Search by Timeline Name or URL"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="searchinput"
                />
            </div>
            <div className="colB">
                <button className="update-display" onClick={handleUpdateDisplayOrder}>Update Display</button>
                <Link href="/afford-admin/addupd-timeline" className="addnew-btn" style={{ width: "110px" }}>
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
                title="Manage TimeLine"
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