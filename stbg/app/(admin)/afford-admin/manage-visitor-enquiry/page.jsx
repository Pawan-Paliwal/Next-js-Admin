'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import ExcelJS from 'exceljs';

import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { useGetAllLeadsQuery, useDeleteEnquiryMutation } from "@/store/backendSlice/contactUsAPISlice";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";
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

const sanitizeCell = (value) => {
  if (!value) return '';
  const stringValue = String(value);
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r', '\n'];

  if (dangerousChars.some(char => stringValue.trim().startsWith(char))) {
    return `'${stringValue}`;
  }

  return stringValue.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
};

export default function ManageVisitorEnquiry() {
  const router = useRouter();
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });
  const pagePermission = usePagePermission(checkData);
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedEnquiryFor, setSelectedEnquiryFor] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data: leadData = [], isLoading, refetch } = useGetAllLeadsQuery();
  const [deleteEnquiry] = useDeleteEnquiryMutation();

  const openMessagePopup = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

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
      router.push("/afford-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (checkData?.loggedIn && pagePermission && pagePermission.CanRead !== 1) {
      toast.error("You do not have permission to view this page");
      router.push("/afford-admin/dashboard");
    }
  }, [checkData, pagePermission, router]);

  // Secure Excel Export Function
  const handleExportToExcel = async () => {
    if (filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      const workbook = new ExcelJS.Workbook();

      workbook.creator = 'Afford Admin Panel';
      workbook.lastModifiedBy = 'Admin';
      workbook.created = new Date();
      workbook.modified = new Date();

      const worksheet = workbook.addWorksheet('Visitor Enquiries', {
        properties: { tabColor: { argb: 'FF0000FF' } }
      });

      worksheet.columns = [
        { header: 'S.No.', key: 'serialNo', width: 10 },
        { header: 'Name', key: 'fullName', width: 25 },
        { header: 'Phone', key: 'phoneNo', width: 15 },
        { header: 'Email', key: 'emailId', width: 30 },
        { header: 'State', key: 'state', width: 20 },
        { header: 'City', key: 'city', width: 20 },
        { header: 'Pincode', key: 'pincode', width: 12 },
        { header: 'Enquiry Type', key: 'enquiryType', width: 20 },
        { header: 'Enquiry For', key: 'enquiryFor', width: 35 },
        { header: 'Date', key: 'postedDate', width: 15 }
      ];

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 20;

      // Add data with sanitization
      filteredData.forEach((item) => {
        worksheet.addRow({
          serialNo: item.SerialNo || '',
          fullName: sanitizeCell(item.FullName),
          phoneNo: sanitizeCell(item.PhoneNo),
          emailId: sanitizeCell(item.EmailID),
          state: sanitizeCell(item.State),
          city: sanitizeCell(item.City),
          pincode: sanitizeCell(item.Pincode),
          enquiryType: sanitizeCell(item.EnquiryType),
          enquiryFor: sanitizeCell(item.EnquiryFor),
          message: sanitizeCell(item.Message),
          postedDate: item.PostedDate || ''
        });
      });

      // Apply borders and formatting
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          // Message column (now column 10)
          if (cell.col === 10) {
            cell.alignment = { wrapText: true, vertical: 'top' };
          }
        });
      });

      // Add auto-filter
      worksheet.autoFilter = {
        from: 'A1',
        to: 'K1'
      };

      // Freeze header row
      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];

      // Generate and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `visitor-enquiries-${new Date().toISOString().split('T')[0]}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const columns = [
    {
      name: "S.No.",
      sortable: true,
      cell: (row) => <div className="user-image-none">{row.SerialNo}</div>,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.FullName,
      sortable: true,
      width: "180px"
    },
    {
      name: "Phone",
      selector: (row) => row.PhoneNo,
      sortable: true,
      width: "135px"
    },
    {
      name: "Email",
      selector: (row) => row.EmailID,
      sortable: true,
      width: "220px"
    },
    {
      name: "State",
      selector: (row) => row.State || '-',
      sortable: true,
      width: "140px"
    },
    {
      name: "City",
      selector: (row) => row.City || '-',
      sortable: true,
      width: "140px"
    },
    {
      name: "Pincode",
      selector: (row) => row.Pincode || '-',
      sortable: true,
      width: "100px"
    },
    {
      name: "Enquiry Type",
      selector: (row) => row.EnquiryType,
      sortable: true,
      width: "150px",
    },
    {
      name: "Enquiry For",
      selector: (row) => row.EnquiryFor,
      sortable: true,
      width: "180px",
    },
    {
      name: "Message",
      cell: (row) => (
        <button onClick={() => openMessagePopup(row)} className="message-btn">
          Show
        </button>
      ),
      width: "100px",
    },
    {
      name: "Date",
      selector: (row) => row.PostedDate,
      sortable: true,
      width: "120px",
    },
    ...(pagePermission?.CanDelete === 1
      ? [
        {
          name: "Delete",
          cell: (row) => (
            <button onClick={() => handleDelete(row.ContactID)} className="edit-icon">
              🗑️
            </button>
          ),
          width: "90px",
        },
      ]
      : []),
  ];

  const getAllEnquiryForOptions = () => {
    const allProducts = new Set();
    (leadData || []).forEach(item => {
      if (item.EnquiryFor) {
        const products = item.EnquiryFor.split(',').map(p => p.trim());
        products.forEach(product => {
          if (product) allProducts.add(product);
        });
      }
    });
    return Array.from(allProducts).sort();
  };

  const filteredData = (leadData || []).filter((item) => {
    const searchText = filterText.toLowerCase();
    const fullName = item.FullName?.toLowerCase() || "";
    const state = item.State?.toLowerCase() || "";
    const city = item.City?.toLowerCase() || "";
    const pincode = item.Pincode?.toLowerCase() || "";

    const matchesText =
      fullName.includes(searchText) ||
      item.EmailID?.toLowerCase().includes(searchText) ||
      item.PhoneNo?.toLowerCase().includes(searchText) ||
      state.includes(searchText) ||
      city.includes(searchText) ||
      pincode.includes(searchText);

    const matchesEnquiryType = !selectedOption || item.EnquiryType === selectedOption;
    const matchesEnquiryFor = !selectedEnquiryFor ||
      (item.EnquiryFor && item.EnquiryFor.split(',').map(p => p.trim()).includes(selectedEnquiryFor));

    return matchesText && matchesEnquiryType && matchesEnquiryFor;
  });

  const subHeaderComponent = (
    <div className="subheader-container">
      <div className="colA">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="dropdown"
        >
          <option value="">Select Type</option>
          {Array.from(new Set((leadData || []).map(item => item.EnquiryType || "")))
            .filter((type) => type)
            .sort()
            .map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
        </select>
        <select
          value={selectedEnquiryFor}
          onChange={(e) => setSelectedEnquiryFor(e.target.value)}
          className="dropdown"
        >
          <option value="">Select Product</option>
          {getAllEnquiryForOptions().map((product) => (
            <option key={product} value={product}>{product}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by Name, Email, Phone, State, City, Pincode"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="searchinput"
        />
      </div>
      <div className="colB">
        {pagePermission?.CanWrite === 1 && (
          <button
            className="update-display"
            onClick={handleExportToExcel}
            disabled={isExporting || filteredData.length === 0}
          >
            {isExporting ? 'Exporting...' : 'Export to Excel'}
          </button>
        )}

      </div>
    </div>
  );

  const handleDelete = async (ContactID) => {
    if (pagePermission?.CanDelete !== 1) {
      toast.error("You do not have permission to delete categories");
      return;
    }
    const confirmed = confirm("Are you sure you want to delete this enquiry?");
    if (!confirmed) return;
    try {
      const res = await deleteEnquiry(ContactID).unwrap();
      if (res.success) {
        toast.success("Visitor Enquiry deleted successfully");
        refetch();
      } else {
        toast.error("Error deleting Enquiry.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const SkeletonLoader = () => (
    <div>
      {[...Array(10)].map((_, i) => (
        <ServiceSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <>
      <main>
        <DataTable
          title="Manage Visitor Enquiry"
          columns={columns}
          data={filteredData}
          striped
          pagination
          highlightOnHover
          selectableRowsHighlight
          subHeader
          paginationRowsPerPageOptions={[10, 30, 50, 100]}
          paginationPerPage={rowsPerPage}
          onChangeRowsPerPage={handlePerRowsChange}
          subHeaderComponent={subHeaderComponent}
          subHeaderWrap
          responsive
          progressPending={isLoading}
          progressComponent={<SkeletonLoader />}
        />
      </main>
      {isPopupOpen && selectedUser && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button className="close-btn" onClick={() => setIsPopupOpen(false)}>×</button>
            <h2>{selectedUser.EnquiryType}, Posted on {selectedUser.PostedDate}</h2>
            <div style={{ marginBottom: "10px" }}>
              <p><strong>Name:</strong> {selectedUser.FullName}</p>
              <p><strong>Email:</strong> {selectedUser.EmailID}</p>
              <p><strong>Phone No:</strong> {selectedUser.PhoneNo}</p>
              {selectedUser.State && <p><strong>State:</strong> {selectedUser.State}</p>}
              {selectedUser.City && <p><strong>City:</strong> {selectedUser.City}</p>}
              {selectedUser.Pincode && <p><strong>Pincode:</strong> {selectedUser.Pincode}</p>}
              <p><strong>Enquiry Type:</strong> {selectedUser.EnquiryType}</p>
              <p><strong>Enquiry For:</strong> {selectedUser.EnquiryFor}</p>
              {selectedUser.Message && <p><strong>Message:</strong> {selectedUser.Message}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}