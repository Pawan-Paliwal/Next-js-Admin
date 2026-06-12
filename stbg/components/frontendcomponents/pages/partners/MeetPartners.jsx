"use client";
import Image from "next/image";

export default function MeetPartners({ data = [] }) {
    if (!data?.length) return null;

    return (
        <section>
            <div className="meet_partners_sec sec-pad-all">
                <div className="container">
                    <div className="main_wrapper">
                        <div className="heading">
                            <h2>Meet Our <span>Partners</span></h2>
                        </div>
                        <div className="partner_wrapper">
                            {data.map(partner => (
                                <figure key={partner.PartnerLogoID}>
                                    <Image
                                        src={`/OnlineImages/PartnerLogoImages/${partner.PartnerLogoImage}`}
                                        alt="Partner Logo"
                                        width={250}
                                        height={100}
                                        priority
                                    />
                                </figure>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
