export const dynamic = 'force-dynamic';
import BlogDetail from "@/components/frontendcomponents/pages/blog/detail";
import { notFound } from "next/navigation";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL as string;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER as string;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS as string;
const authHeader =
  username && password
    ? "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
    : "";

interface BlogMeta {
  BlogID: number;
  BlogName: string;
  BlogNameURL: string;
  BlogImage?: string;
  BlogBannerImage?: string;
  Description?: string;
  MetaTitle?: string;
  MetaKeywords?: string;
  MetaDescriptions?: string;
  MetaSchema?: string;
  PostedDate?: string;
  [key: string]: any;
}
async function fetchBlogBySlug(slug: string): Promise<BlogMeta | null> {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  });

  const result = await baseQuery(
    { url: `/blog/fetch-blog/${slug}` },
    {} as any,
    {}
  ) as { data?: { success: boolean, data?: BlogMeta }, error?: any };

  if ("error" in result && result.error) {
    console.error("❌ Blog slug fetch failed:", result.error);
    return null;
  }
  return result.data?.data || null;
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = await fetchBlogBySlug(slug);
  if (!meta) {
    return {
      title: "Page Not Found - Chanderpur Group",
      description: "The page you are looking for does not exist.",
    };
  }

  const imageFile = meta.BlogBannerImage || meta.BlogImage;
  const ogImage = imageFile
    ? `${API_URL}/uploads/${imageFile}`
    : `${CANONICAL_URL}/OGImage/default.jpg`;

  return {
    metadataBase: new URL(CANONICAL_URL),
    title: meta.MetaTitle || meta.BlogName || "Chanderpur Group",
    description: meta.MetaDescriptions || "Engineering excellence across industries.",
    keywords: meta.MetaKeywords || "",
    alternates: { canonical: `${CANONICAL_URL}/blogs/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: `${CANONICAL_URL}/blogs/${slug}`,
      title: meta.MetaTitle || meta.BlogName || "Chanderpur Group",
      description: meta.MetaDescriptions || "Engineering excellence across industries.",
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.BlogName || slug }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.MetaTitle || meta.BlogName || "Chanderpur Group",
      description: meta.MetaDescriptions || "Engineering excellence across industries.",
      images: [ogImage],
    },
    icons: { icon: "/favicon.ico" },
  };
}

interface BlogDetailsProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetails({ params }: BlogDetailsProps) {
  const { slug } = await params;
  const meta = await fetchBlogBySlug(slug);

  if (!meta) notFound();

  return <BlogDetail blogId={slug} initialData={meta} />;
}


