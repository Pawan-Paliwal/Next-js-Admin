// app/page.tsx
export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import { fetchMetaDataById } from "@/store/frontendSlice/metaAPISlice";
import PartnersPage from "@/components/frontendcomponents/pages/partners";

const API_ID = 6;
const CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "http://localhost:3000";

const ALLOWED_DOMAINS = [
  "https://affordplan.com",
  "http://affordplan.com",
  "https://www.affordplan.com",
  "http://www.affordplan.com",
];


function shouldIndexDomain(): boolean {
  return ALLOWED_DOMAINS.some(domain =>
    CANONICAL_URL.startsWith(domain)
  );
}


export async function generateMetadata(): Promise<Metadata> {
  try {
    const meta = await fetchMetaDataById(API_ID);
    const defaultTitle = "afford";
    const shouldIndex = shouldIndexDomain();
    return {
      title: meta?.MetaTitle || defaultTitle,
      description: meta?.MetaDescriptions || "",
      keywords: meta?.MetaKeywords || "",
      alternates: { canonical: `${CANONICAL_URL}/partners` },
      robots: {
        index: shouldIndex,
        follow: shouldIndex,
      },
      openGraph: {
        type: "website",
        url: `${CANONICAL_URL}/partners`,
        title: meta?.MetaTitle || defaultTitle,
        description: meta?.MetaDescriptions || "",
        images: [
          {
            url: "/logo.svg",
            width: 1200,
            height: 630,
            alt: "afford",
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
      title: "afford",
      description: "",
    };
  }
}

export default function PartnersPageData() {
  return (
    <PartnersPage />
  );
}