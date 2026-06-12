import Footer from "../organisms/Footer";
import Header from "../organisms/Header";
import TrademarkReplacer from "@/components/TrademarkReplacer";

export default function MainTemplate({ children }) {
    return(
        <>
    <TrademarkReplacer />
            <Header />
                {children}
            <Footer />
        </>
    )
}