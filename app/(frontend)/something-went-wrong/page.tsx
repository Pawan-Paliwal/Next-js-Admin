export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import Link from "next/link";
import { fetchMetaDataById } from "@/store/frontendSlice/metaAPISlice";

const API_ID = 16;
const CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "http://localhost:3003";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const meta = await fetchMetaDataById(API_ID);
    const defaultTitle = "Chanderpur Group";

    return {
      title: meta?.MetaTitle || defaultTitle,
      description: meta?.MetaDescriptions || "",
      keywords: meta?.MetaKeywords || "",
      alternates: { canonical: CANONICAL_URL },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        type: "website",
        url: CANONICAL_URL,
        title: meta?.MetaTitle || defaultTitle,
        description: meta?.MetaDescriptions || "",
        images: [
          {
            url: "/logo.svg",
            width: 1200,
            height: 630,
            alt: "Chanderpur Group",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: meta?.MetaTitle || defaultTitle,
        description: meta?.MetaDescriptions || "",
        images: ["/logo.svg"],
      },
      icons: {
        icon: "/favicon.ico",
      },
    };
  } catch (err) {
    console.error("Meta fetch failed", err);
    return {
      title: "Chanderpur Group",
      description: "",
    };
  }
}

export default function SomethingWentWrong() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          borderRadius: "16px",
          padding: "60px 40px",
        }}
      >
        <div
          style={{
            fontSize: "120px",
            fontWeight: "700",
            background: "#223c89",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: "1",
            marginBottom: "20px",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "600",
            color: "#2d3748",
            marginBottom: "16px",
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#718096",
            marginBottom: "40px",
            lineHeight: "1.6",
          }}
        >
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "#223c89",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
          }}
        >
          Go Back Home
        </Link>
        <div
          style={{
            marginTop: "40px",
            paddingTop: "30px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#a0aec0",
            }}
          >
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}