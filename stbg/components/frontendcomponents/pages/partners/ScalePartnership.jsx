import Image from "next/image";

export default function ScalePartnership({ statsData }) {
    if (!statsData) return null;


    return (
        <section>
            <div className="scale_partnership sec-pad-all">
                <div className="container">
                    <div className="main_wrapper">
                        <div className="heading">
                            <h2>Partnerships that scale impact, Connections that <span>deliver real outcomes</span></h2>
                            <figure>
                                <Image src="/assets/logo-vector.svg" width="100" height="80" alt="Logo Vector"></Image>
                            </figure>
                        </div>
                        <div className="count_info_wrap">
                            {statsData.NoOfPartners && (
                                <div className="info_col">
                                    <h4 className="count">{statsData.NoOfPartners}+</h4>
                                    <p>Partners</p>
                                </div>
                            )}
                            {statsData.HowManyCities && (
                                <div className="info_col">
                                    <h4 className="count">{statsData.HowManyCities}+</h4>
                                    <p>Cities</p>
                                </div>
                            )}
                            {statsData.ActiveCollaboration && (
                                <div className="info_col">
                                    <h4 className="count">{statsData.ActiveCollaboration}+</h4>
                                    <p>Active Collaboration</p>
                                </div>
                            )}
                            {statsData.StrategicAlliances && (
                                <div className="info_col">
                                    <h4 className="count">{statsData.StrategicAlliances}+</h4>
                                    <p>Strategic Alliances</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}