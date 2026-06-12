import { Red_Hat_Display, Poppins } from "next/font/google";
import "../../app/globals.css";
import { ReduxProvider } from "../../store/ReduxProvider";
import Header from "@/components/frontendcomponents/organisms/Header";
import Footer from "@/components/frontendcomponents/organisms/Footer";
import EnquireModal from "@/components/frontendcomponents/organisms/EnquireModal";
import Overlay from "@/components/frontendcomponents/organisms/Overlay";
import MenuModal from "@/components/frontendcomponents/organisms/MenuModal";
import VideoModal from "@/components/frontendcomponents/organisms/VideoModal";
import TeamModal from "@/components/frontendcomponents/organisms/TeamModal";
import CTA from "@/components/frontendcomponents/organisms/CTA";



const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-red-hat-display",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Chanderpur Group",
  description: "Advanced Manufacturing for Global Industries",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${redHatDisplay.variable} ${poppins.variable}`}
    >
      <body cz-shortcut-listen="true">
        <ReduxProvider>
          <Header />
          <main className="mt-[54px]  xl:mt-[103px] ">{children}</main>
          <Footer />
          <CTA />
          <Overlay />
          <TeamModal />
          <MenuModal />
          <EnquireModal />
          <VideoModal />
        </ReduxProvider>
      </body>
    </html>
  );
}
