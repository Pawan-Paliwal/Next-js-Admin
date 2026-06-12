import Image from "next/image";
import Link from "next/link";
import "@/uploads/styles/component/component.css"

export default function FooterStrip(){
    return(  
        <div className="footer-strip">
            <ul>
                <li>
                    <Link href="/swasth">
                        <Image src="/OnlineImages/CategoryImages/families-image-29.svg" width="30" height="30" alt="Vector Icon"></Image>
                        Swasth
                    </Link>
                </li>
                <li>
                    <Link href="/procalyx">
                        <Image src="/OnlineImages/CategoryImages/hospital-image-98.svg" width="30" height="30" alt="Vector Icon"></Image>
                        Procalyx™
                    </Link>
                </li>
                <li>
                    <Link href="/swasthera">
                        <Image src="/OnlineImages/CategoryImages/wellness-brand-image-78.svg" width="30" height="30" alt="Vector Icon"></Image>
                        Swasthera
                    </Link>
                </li>
            </ul>
        </div>
    )
}