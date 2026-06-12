import { Suspense } from "react";
import type { Metadata } from "next";
import "./global.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { ReduxProviderFront } from "../../store/ReduxProviderFront";
import { Poppins } from "next/font/google";
import MainTemplate from "@/components/frontendcomponents/template/MainTemplate";
import GoogleTranslator from "@/components/frontendcomponents/organisms/GoogleTranslator";
import Loader from "@/app/loading";

export const metadata: Metadata = {
  title: "Affordplan | Healthcare Financing Platform in India",
  description: "Affordable Health Savings Plan",
  openGraph: {
    images: ["https://affordplan.com/OGImage/healthcare-financing-platform.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* ── Geo & General Meta ─────────────────────────────────── */}
        <meta name="geography" content="India" />
        <meta name="geo.region" content="IN-HR" />
        <meta name="geo.placename" content="Gurgaon" />
        <meta name="geo.position" content="28.4409625;77.1031196" />
        <meta name="ICBM" content="28.4409625, 77.1031196" />
        <meta name="dc.language" content="English" />
        <meta name="category" content="Fintech" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="Rating" content="General" />
        <meta name="subject" content="Affordable Health Savings Plan" />
        <meta name="topic" content="Affordable health savings Plan" />
        <meta name="author" content="Affordplan" />
        <meta name="publisher" content="Affordplan" />
        <meta name="copyright" content="Usekiwi Infolabs Pvt. Ltd." />
        <meta name="owner" content="Usekiwi Infolabs Pvt. Ltd." />

        {/* ── Robots ─────────────────────────────────────────────── */}
        <meta content="FOLLOW, INDEX, ALL" name="robots" />
        <meta content="yes" name="ALLOW-SEARCH" />
        <meta content="all" name="AUDIENCE" />
        <meta content="index, follow" name="YahooSeeker" />
        <meta content="index, follow" name="msnbot" />
        <meta content="index, follow" name="googlebot" />
        {/* ── Google Verification ────────────────────────────────── */}
        <meta name="google-site-verification" content="MsJjqWfEI2GBjSis45sEybQ7BZOEM_dsk7xBpV_iv8s" />
        {/* ── Google Analytics ───────────────────────────────────── */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1VWVXRG4D5" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1VWVXRG4D5');
            `,
          }}
        />
        {/* ── Schema: WebSite ────────────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Affordplan",
              alternateName: "Affordplan | Healthcare Financing Platform in India",
              url: "https://affordplan.com/",
            }),
          }}
        />

        {/* ── Schema: LocalBusiness ──────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Affordplan",
              url: "https://affordplan.com/",
              image: "https://affordplan.com/OGImage/healthcare-financing-platform.png",
              priceRange: "₹₹",
              telephone: "+919250050501",
              email: "info@affordplan.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "3rd Floor, TTF-01, Ocus Technopolis, Tower B Unit No, Sector 54",
                addressLocality: "Gurugram, Haryana",
                addressCountry: "India",
                postalCode: "122011",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                bestRating: "5",
                reviewCount: "441",
              },
              openingHours: ["Mon-Sat 10:00am -06:30pm"],
            }),
          }}
        />

        {/* ── Schema: Organization ───────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Affordplan",
              url: "https://affordplan.com/",
              image: "https://affordplan.com/OGImage/healthcare-financing-platform.png",
              sameAs: [
                "https://x.com/MyAffordplan/",
                "https://www.facebook.com/myaffordplan/",
                "https://www.instagram.com/my_affordplan/",
                "https://www.linkedin.com/company/affordplan/",
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "3rd Floor, TTF-01, Ocus Technopolis, Tower B Unit No, Sector 54",
                addressRegion: "Gurugram",
                postalCode: "122011",
                addressCountry: "India",
              },
            }),
          }}
        />
      </head>
      <ReduxProviderFront>
        <body cz-shortcut-listen="true" suppressHydrationWarning>
          <NextTopLoader showSpinner={false} />
          <Suspense fallback={<Loader />}>
            <MainTemplate>
              <GoogleTranslator />
              {children}
            </MainTemplate>
          </Suspense>
          <Toaster
            position="top-center"
            reverseOrder={true}
            toastOptions={{
              duration: 1200,
              style: {
                background: "rgba(0,0,0,0.85)",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "14px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                backdropFilter: "blur(6px)",
              },
              success: {
                style: {
                  background: "rgba(34, 197, 94, 0.9)",
                  borderRadius: "4px",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#15803d",
                },
              },
              error: {
                style: {
                  background: "rgba(239, 68, 68, 0.9)",
                  borderRadius: "4px",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#b91c1c",
                },
              },
            }}
          />
        </body>
      </ReduxProviderFront>
    </html>
  );
}