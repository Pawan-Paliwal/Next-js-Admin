import { Metadata } from "next";
import { fetchMetaDataByUrl, MetaDataType } from "@/store/frontendSlice/metaAPISlice";
import { redirect } from "next/navigation";
import DynamicPageClient from "./DynamicPageClient";

const CANONICAL_URL =
    process.env.NEXT_PUBLIC_CANONICAL_URL ?? "http://localhost:3003";

export async function generateMetadata({ params, }: { params: Promise<{ slug: string }>; }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const meta = await fetchMetaDataByUrl(slug);
        const defaultTitle = "Chanderpur Group";
        return {
            title: meta?.MetaTitle || defaultTitle,
            description: meta?.MetaDescriptions || "",
            keywords: meta?.MetaKeywords || "",
            alternates: { canonical: `${CANONICAL_URL}/${slug}` },
            robots: {
                index: true,
                follow: true,
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
                        alt: "flextron",
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



export default async function DynamicPage({ params }: any) {
    const { slug } = await params;
    let meta: MetaDataType | undefined;
    try {
        meta = await fetchMetaDataByUrl(slug);
    } catch (err) {
        console.error("Page fetch failed", err);
        redirect("/something-went-wrong");
    }
    if (!meta) {
        redirect("/something-went-wrong");
    }
    return <DynamicPageClient meta={meta} slug={slug} />;
}
