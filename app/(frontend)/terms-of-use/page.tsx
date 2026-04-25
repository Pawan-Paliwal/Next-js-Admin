// app/page.tsx
export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import { fetchMetaDataById } from "@/store/frontendSlice/metaAPISlice";
const API_ID = 10;
const CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const meta = await fetchMetaDataById(API_ID);
    const defaultTitle = "chanderpur";
    return {
      title: meta?.MetaTitle || defaultTitle,
      description: meta?.MetaDescriptions || "",
      keywords: meta?.MetaKeywords || "",
      alternates: { canonical: `${CANONICAL_URL}/terms-of-use` },
      openGraph: {
        type: "website",
        url: `${CANONICAL_URL}/terms-of-use`,
        title: meta?.MetaTitle || defaultTitle,
        description: meta?.MetaDescriptions || "",
        images: [
          {
            url: "/logo.svg",
            width: 1200,
            height: 630,
            alt: "chanderpur",
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
    return {
      title: "chanderpur",
      description: "",
    };
  }
}

export default function TermsConditionspage() {
  return (
    <>
      <h1>Terms of Use</h1>
    </>
  );
}