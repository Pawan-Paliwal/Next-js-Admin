"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { useGetAdminDashboardQuery, useGetMonthWiseReportQuery } from "@/store/backendSlice/reportSummaryAPISlice";
import { useLogoutMutation, authAPISlice, useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { usePagePermission } from "../usePagePermission";
import toast from "react-hot-toast";
import { useState, useMemo, useEffect } from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const STBG_TEAL = "#1c2f63";
const STBG_ORANGE = "#065e87";

const Icons = {
  Base: ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H12V22L22 10H13V2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

const themeStyles = {
  container: { padding: '12px', fontFamily: "'Outfit', sans-serif", display: 'flex', flexDirection: 'column', gap: '12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' },
  miniCard: { backgroundColor: '#fff', borderRadius: '10px', padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #EDEDED' },
  iconBoxMini: (color, bg) => ({ width: '20px', height: '20px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: bg, color: color }),
};

const MiniCard = ({ label, value, color, bg, link = "#", big = false }) => (
  <Link href={link} style={{ ...themeStyles.miniCard, textDecoration: 'none', borderBottom: big ? `3px solid ${color}` : themeStyles.miniCard.border, transition: 'transform 0.2s ease' }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={themeStyles.iconBoxMini(color, bg)}><Icons.Base style={{ width: '12px', height: '12px' }} /></div>
    </div>
    <h3 style={{ color: '#1E293B', fontSize: big ? '22px' : '16px', fontWeight: '500', margin: 0 }}>{value?.toLocaleString() || 0}</h3>
    <p style={{ color: '#64748B', fontSize: '9px', fontWeight: '500', margin: 0, textTransform: 'uppercase' }}>{label}</p>
  </Link>
);

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = isAuthCheckSuccess && checkData?.loggedIn && pagePermission?.PageID !== 0;

  // ✅ loginID is the unique identifier in this project
  const isAdmin = (checkData?.user?.loginID || checkData?.user?.[0]?.loginID) === 1 || checkData?.user?.Role === "Super Admin";

  const { data: dashData, isLoading: dashLoading } = useGetAdminDashboardQuery();
  const { data: chartData, isLoading: chartLoading } = useGetMonthWiseReportQuery();
  const [logout] = useLogoutMutation();
  const [activeTab, setActiveTab] = useState("enquiries");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1920);

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const h = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', h);
      return () => window.removeEventListener('resize', h);
    }
  }, []);

  const p = dashData?.predictionCounts || {};
  const totalEnquiries = chartData?.currentYearArray?.reduce((a, b) => a + b, 0) || 0;

  const handleLogout = async () => {
    try {
      const result = await logout(undefined).unwrap();
      if (result.success) {
        dispatch(authAPISlice.util.updateQueryData("checkLogin", undefined, (draft) => { draft.loggedIn = false; draft.user = null; }));
        router.push("/chanderpur-admin/login");
      }
    } catch (e) { console.error(e); }
  };

  const allStats = useMemo(() => [
    { label: "Total Blogs", value: p.TotalBlog, color: STBG_TEAL, bg: '#E0F2F2', big: true, link: "/chanderpur-admin/manage-blog" },
    { label: "Awards", value: p.TotalAward, color: STBG_ORANGE, bg: '#FFF3E0', link: "/chanderpur-admin/manage-award" },
    { label: "Careers", value: p.TotalCareer, color: STBG_TEAL, bg: '#E0F2F2', link: "/chanderpur-admin/manage-career" },
    { label: "Companies", value: p.TotalCompany, color: STBG_ORANGE, bg: '#FFF3E0', link: "/chanderpur-admin/manage-company" },
    { label: "Testimonials", value: p.TotalTestimonial, color: STBG_TEAL, bg: '#E0F2F2', link: "/chanderpur-admin/manage-testimonial" },
    { label: "Enquiries", value: p.TotalEnquiry, color: STBG_TEAL, bg: '#E0F2F2', link: "/chanderpur-admin/manage-visitor-enquiry" },
    { label: "F. Categories", value: p.TotalFacilityCategory, color: STBG_ORANGE, bg: '#FFF3E0', link: "/chanderpur-admin/manage-facilitycategory" },
    { label: "F. Products", value: p.TotalFacilityProduct, color: STBG_TEAL, bg: '#E0F2F2', link: "/chanderpur-admin/manage-facilityproduct" },
    { label: "Client Types", value: p.TotalClientType, color: STBG_ORANGE, bg: '#FFF3E0', link: "/chanderpur-admin/manage-clienttype" },
    { label: "What's New", value: p.TotalWhatsNew, color: STBG_TEAL, bg: '#E0F2F2', link: "/chanderpur-admin/manage-whatsnew" },
  ], [p]);

  const row1 = allStats.slice(0, 5);
  const row2 = allStats.slice(5, 10);

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Enquiries',
      data: chartData?.currentYearArray || Array(12).fill(0),
      borderColor: STBG_TEAL, backgroundColor: 'rgba(28, 47, 99, 0.05)',
      tension: 0.4, fill: true, borderWidth: 2, pointRadius: 1,
    }]
  };

  if (dashLoading || chartLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #1c2f63', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const isSmall = windowWidth < 1200;

  const WelcomeBanner = () => (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '15px 30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: "100%",
      margin: "10px 11px"
    }}>
      <div style={{ flex: 1, paddingRight: '30px' }}>
        <h4 style={{
          margin: 0, marginBottom: '12px', fontSize: '22px', fontWeight: 600,
          color: '#1c2f63', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          Welcome to the Chanderpur Group Admin Dashboard
        </h4>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
          Founded in 1962 by Shri Sumesh Chandra, Chanderpur Group has grown into a global leader, <br /> serving clients across continents with excellence and innovation.
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/" target='_blank' style={{
            padding: '8px 20px', backgroundColor: 'transparent', color: '#1c2f63',
            border: '1.5px solid #1c2f63', borderRadius: '6px', fontSize: '13px',
            fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s ease', textDecoration: 'none'
          }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#1c2f63'; e.target.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#1c2f63'; }}>
            View Website
          </Link>
          <button onClick={handleLogout} style={{
            padding: '8px 20px', backgroundColor: '#065e87',
            color: 'white', border: '1.5px solid #065e87', borderRadius: '6px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease'
          }}>Logout</button>
        </div>
      </div>
      <div style={{ flex: '0 0 auto' }}>
        <img
          src="/assets/images/man-with-laptop-light.png"
          alt="Man with laptop illustration"
          style={{ width: '135px', height: 'auto', display: 'block' }}
        />
      </div>
    </div>
  );



  return (
    <main style={{ padding: "12px" }}>
      <div>
        <WelcomeBanner />
      </div>
      {isAdmin && (
        <div style={{ padding: 0 }}>
          <div style={themeStyles.container}>
            <div style={{ ...themeStyles.grid, gridTemplateColumns: isSmall ? 'repeat(auto-fit, minmax(150px, 1fr))' : 'repeat(5, 1fr)' }}>
              {row1.map((s, i) => <MiniCard key={i} {...s} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '10px', border: '1px solid #EDEDED', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>Monthly Enquiries Statistics</h4>
                  <div style={{ fontSize: '18px', fontWeight: '500', color: STBG_TEAL }}>{totalEnquiries.toLocaleString()}</div>
                </div>
                <div style={{ height: '300px' }}>
                  <Line data={salesData} options={{
                    responsive: true, maintainAspectRatio: false, animation: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [5, 5] }, beginAtZero: true } }
                  }} />
                </div>
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '10px', border: '1px solid #EDEDED', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h4 style={{ margin: 0, color: '#1E293B', fontSize: '14px', fontWeight: '500' }}>Recent Enquiries</h4>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {["enquiries"].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        border: 'none', background: activeTab === tab ? STBG_TEAL : '#F1F5F9',
                        color: activeTab === tab ? '#fff' : '#64748B', padding: '4px 8px',
                        borderRadius: '6px', fontWeight: '500', fontSize: '9px', cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                    ))}
                  </div>
                </div>
                <div style={{ maxHeight: '310px', overflowY: 'auto', paddingRight: '4px' }}>
                  {dashData?.recentEnquiries?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: STBG_TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '500', color: '#fff', flexShrink: 0 }}>
                          {(item.FullName || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '500', color: '#1E293B' }}>{item.FullName}</div>
                            {item.EnquiryType && <span style={{ fontSize: '9px', background: '#E0F2F2', color: '#016F6C', padding: '1px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>{item.EnquiryType}</span>}
                          </div>
                          <div style={{ fontSize: '10px', color: '#64748B' }}>{item.FormattedDate || item.PostedDate}</div>
                        </div>
                      </div>
                      <button onClick={() => { setSelectedUser(item); setIsPopupOpen(true); }}
                        style={{ border: 'none', background: STBG_TEAL, color: '#fff', padding: '5px 12px', borderRadius: '6px', fontWeight: '500', fontSize: '10px', cursor: 'pointer' }}>
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {row2.length > 0 && (
              <div style={{ ...themeStyles.grid, gridTemplateColumns: isSmall ? 'repeat(auto-fit, minmax(150px, 1fr))' : 'repeat(5, 1fr)', marginTop: '4px' }}>
                {row2.map((s, i) => <MiniCard key={i} {...s} />)}
              </div>
            )}
          </div>
        </div>
      )}
      {isPopupOpen && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: STBG_TEAL }}>Enquiry Details</h3>
              <button onClick={() => setIsPopupOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '11px' }}>FULL NAME</p>
                <p style={{ margin: 0, fontWeight: '500' }}>{selectedUser.FullName}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '11px' }}>EMAIL ADDRESS</p>
                <p style={{ margin: 0, fontWeight: '500', wordBreak: 'break-all' }}>{selectedUser.EmailID || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '11px' }}>PHONE NUMBER</p>
                <p style={{ margin: 0, fontWeight: '500' }}>{selectedUser.PhoneNo || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '11px' }}>COUNTRY</p>
                <p style={{ margin: 0, fontWeight: '500' }}>{selectedUser.CountryName || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '11px' }}>ENQUIRY FOR</p>
                <p style={{ margin: 0, fontWeight: '500' }}>{selectedUser.EnquiryFor || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '11px' }}>TYPE</p>
                <p style={{ margin: 0, fontWeight: '500' }}>{selectedUser.EnquiryType || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '11px' }}>POSTED DATE</p>
                <p style={{ margin: 0, fontWeight: '500' }}>{selectedUser.FormattedDate || selectedUser.PostedDate}</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <p style={{ margin: '0 0 5px 0', color: '#64748B', fontSize: '11px' }}>MESSAGE</p>
                <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px', minHeight: '60px' }}>
                  {selectedUser.Message || 'No message provided.'}
                </div>
              </div>
            </div>
            <button onClick={() => { setIsPopupOpen(false); setSelectedUser(null); }}
              style={{ marginTop: '24px', width: '100%', padding: '12px', background: STBG_TEAL, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '500', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
      <style jsx global>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </main>
  );
}
