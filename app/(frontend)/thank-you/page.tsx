export const dynamic = "force-dynamic";
import Link from "next/link";

export const metadata = {
  title: "Thank You | Chanderpur Group",
  description: "Your enquiry has been successfully submitted.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <section className="bg-primary py-14 h-[60vh] flex justify-center items-center md:py-20 text-center">
        <div className="container">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/30">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mb-2 text-xs  text-center font-medium uppercase tracking-widest text-white/50">
            Submission Successful
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Thank You!
          </h1>
          <p className="mt-3 text-sm text-center text-white/60">
            Your enquiry has been received by our team.
          </p>
        </div>
      </section>
    </>
  );
}

