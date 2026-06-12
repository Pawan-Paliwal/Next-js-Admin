import { Suspense } from 'react';
import Head from 'next/head';
import "../../../public/admin-assets/styles/style.css";
import MainHeaderFooter from "@/components/backendcomponents/MainHeaderFooter";
import NextTopLoader from "nextjs-toploader";
import '../../../public/admin-assets/fonts/font.css';
import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from "../../../store/ReduxProvider";
import Loader from "@/app/loading";

export const metadata = {
  title: "AffordPlan Admin Panel",
  description: "AffordPlan Admin Panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ReduxProvider>
        <Head>
          <title>AffordPlan Admin Panel</title>
          <meta name="description" content="Admin Panel for AffordPlan" />
        </Head>
        <body>
          <NextTopLoader color="#243b56" showSpinner={false} />
          <MainHeaderFooter />
          <Suspense fallback={<Loader />}>
            {children}
          </Suspense>
          <Toaster
            position="top-center"
            reverseOrder={true}
            toastOptions={{
              duration: 2000,
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
      </ReduxProvider>
    </html>
  );
}
