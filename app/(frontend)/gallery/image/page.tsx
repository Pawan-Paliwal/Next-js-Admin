export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import { fetchMetaDataById } from "@/store/frontendSlice/metaAPISlice";
import ImageGallery from "@/components/frontendcomponents/pages/gallery/image";

const API_ID = 25;
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

export default function ImageGalleryPage() {
  return <ImageGallery />;
}
