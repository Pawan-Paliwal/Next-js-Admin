"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";

export default function Dashboard() {

  return (
    <main>
      <div className="main-wrap">
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '30px 40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          width: "100%"
        }}>
          <div style={{
            flex: 1,
            paddingRight: '30px'
          }}>
            <div className="title">
              <h4 style={{
                margin: 0,
                marginBottom: '12px',
                fontSize: '22px',
                fontWeight: 600,
                color: '#1c2f63',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Welcome to the Chanderpur Group Admin Dashboard
              </h4>
            </div>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#64748b',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Founded in 1962 by Shri Sumesh Chandra, Chanderpur Group has grown into a global leader, <br /> serving clients across continents with excellence and innovation.
            </p>
            <Link href="/" target='_blank' style={{
              padding: '8px 20px',
              backgroundColor: 'transparent',
              color: '#1c2f63',
              border: '1.5px solid #1c2f63',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1c2f63';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#1c2f63';
              }}>
              View Website
            </Link>
          </div>
          <div style={{
            flex: '0 0 auto'
          }}>
            <img
              src="/assets\images\man-with-laptop-light.png"
              alt="Man with laptop illustration"
              style={{
                width: '135px',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}


