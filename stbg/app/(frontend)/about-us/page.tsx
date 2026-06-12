// app/page.tsx
export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import { fetchMetaDataById } from "@/store/frontendSlice/metaAPISlice";
import AboutUsPage from "@/components/frontendcomponents/pages/about-us";

const API_ID = 2;
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
    const shouldIndex = shouldIndexDomain();
    const defaultTitle = "afford";
    return {
      title: meta?.MetaTitle || defaultTitle,
      description: meta?.MetaDescriptions || "",
      keywords: meta?.MetaKeywords || "",
      alternates: { canonical: `${CANONICAL_URL}/about-us` },
      robots: {
        index: shouldIndex,
        follow: shouldIndex,
      },
      openGraph: {
        type: "website",
        url: `${CANONICAL_URL}/about-us`,
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

export default function AboutUspage() {
  return (
    <AboutUsPage />
  );
}