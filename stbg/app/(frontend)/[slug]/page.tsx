// app/[slug]/page.tsx
import { Metadata } from "next";
import { fetchMetaDataByUrl } from "@/store/frontendSlice/metaAPISlice";
import { redirect } from "next/navigation";
import DynamicPageClient from "./DynamicPageClient";
const CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "http://localhost:3003";
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


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const shouldIndex = shouldIndexDomain();
  try {
    const meta = await fetchMetaDataByUrl(slug);
    const defaultTitle = "AffordPlan";
    return {
      title: meta?.MetaTitle || defaultTitle,
      description: meta?.MetaDescriptions || "",
      keywords: meta?.MetaKeywords || "",
      alternates: { canonical: `${CANONICAL_URL}/${slug}` },
      robots: {
        index: shouldIndex,
        follow: shouldIndex,
      },
      openGraph: {
        type: "website",
        url: `${CANONICAL_URL}/${slug}`,
        title: meta?.MetaTitle || defaultTitle,
        description: meta?.MetaDescriptions || "",
        images: [
          {
            url: "/logo.svg",
            width: 1200,
            height: 630,
            alt: "AffordPlan",
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
      title: "AffordPlan",
      description: "",
    };
  }
}

export default async function DynamicPage({ params }: any) {
  const { slug } = await params;
  let meta;
  try {
    meta = await fetchMetaDataByUrl(slug);
  } catch (err) {
    redirect("/something-went-wrong");
  }
  if (!meta) {
    redirect("/something-went-wrong");
  }
  return <DynamicPageClient meta={meta} slug={slug} />;
}