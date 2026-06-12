import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;

const CANONICAL_URL = 'https://affordplan.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getPriorityFromPath(pathStr: string) {
    if (pathStr === "/") return "1.00";
    const high = ["/about-us", "/partners", "/media", "/contact-us"];
    const medium = ["/careers", "/swasth", "/procalyx"];
    const low = ["/terms-conditions", "/privacy-policy", "/swasthera-page"];
    if (high.includes(pathStr)) return "0.80";
    if (medium.includes(pathStr)) return "0.64";
    if (low.includes(pathStr)) return "0.50";
    return "0.75";
}

function getChangeFreqFromPath(pathStr: string) {
    if (pathStr === "/") return "daily";
    if (pathStr === "/media") return "daily";
    if (pathStr === "/careers") return "daily";
    if (["/about-us", "/partners", "/contact-us"].includes(pathStr)) return "daily";
    if (["/terms-conditions", "/privacy-policy"].includes(pathStr)) return "daily";
    return "weekly";
}

async function fetchProducts() {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (username && password) {
            const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
            headers['Authorization'] = `Basic ${basicAuth}`;
        }
        const response = await fetch(`${API_BASE_URL}/product/all-products`, {
            cache: 'no-store',
            headers: headers
        });
        if (!response.ok) {
            console.error("Failed to fetch products:", response.statusText);
            return [];
        }
        const data = await response.json();
        console.log('Fetched products:', data.length);
        return data.filter((product: any) => product.ActiveStatus === 1);
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

async function fetchCaseStudies() {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (username && password) {
            const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
            headers['Authorization'] = `Basic ${basicAuth}`;
        }
        const response = await fetch(`${API_BASE_URL}/casestudies/all-casestudies`, {
            cache: 'no-store',
            headers: headers
        });
        if (!response.ok) {
            console.error("Failed to fetch case studies:", response.statusText);
            return [];
        }
        const data = await response.json();
        console.log('Fetched case studies:', data.length);
        return data.filter((caseStudy: any) => caseStudy.ActiveStatus === 1);
    } catch (error) {
        console.error("Error fetching case studies:", error);
        return [];
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action");
        const now = new Date().toISOString();

        const staticPaths = [
            "/",
            "/about-us",
            "/contact-us",
            "/media",
            "/careers",
            "/partners",
            "/swasth",
            "/procalyx",
            "/privacy-policy",
            "/terms-conditions",
            "/swasthera-page"
        ];
        const products = await fetchProducts();
        const productPaths = products.map((product: any) => {
            return `/${product.ProductType}`;
        });
        const caseStudies = await fetchCaseStudies();
        const caseStudyPaths = caseStudies.map((caseStudy: any) => {
            return `/${caseStudy.CaseStudyNameURL}`;
        });
        const allPaths = [...staticPaths, ...productPaths, ...caseStudyPaths];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPaths.map((pathStr) => {
            const priority = getPriorityFromPath(pathStr);
            const changefreq = getChangeFreqFromPath(pathStr);
            return `  <url>
    <loc>${CANONICAL_URL}${pathStr}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        }).join("\n")}
</urlset>`;
        if (action === "save") {
            try {
                const publicDir = path.join(process.cwd(), "uploads");
                const sitemapPath = path.join(publicDir, "sitemap.xml");

                if (!fs.existsSync(publicDir)) {
                    fs.mkdirSync(publicDir, { recursive: true });
                }

                if (fs.existsSync(sitemapPath)) {
                    fs.unlinkSync(sitemapPath);
                }

                fs.writeFileSync(sitemapPath, xml, "utf8");

                return NextResponse.json({
                    success: true,
                    message: "Sitemap saved to /uploads/sitemap.xml",
                    timestamp: now,
                    totalPages: allPaths.length,
                    staticPages: staticPaths.length,
                    productPages: productPaths.length,
                    caseStudyPages: caseStudyPaths.length,
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                return NextResponse.json(
                    {
                        success: false,
                        message: "Failed to save sitemap",
                        error: errorMessage,
                    },
                    { status: 500 }
                );
            }
        }
        return new NextResponse(xml, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
            },
        });
    } catch (error) {
        console.error("Sitemap error:", error);
        return new NextResponse(
            `<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>`,
            {
                status: 500,
                headers: {
                    "Content-Type": "application/xml",
                },
            }
        );
    }
}
