import Image from "next/image";
import Link from "next/link";

export default function LocationSec() {
    return (
        <section>
            <div className="location_sec sec-pad-all">
                <div className="container">
                    <div className="heading">
                        <h2>Affordplan <span>Locations</span></h2>
                    </div>
                    <div className="location_wrapper">
                        <div className="loc_col">
                            <div className="upper_sec">
                                <h6>Mumbai</h6>
                                <div className="icon">
                                    <Image src="/assets/icon/location_grad.svg" width="50" height="50" alt="Contact Icon"></Image>
                                </div>
                            </div>
                            <div className="details">
                                <p >91 SpringBoard, Godrej & Boyce, Gate No 2, Plant No. 6, LBS Marg, Opposite Vikhroli Bus Depot, Vikhroli West, Mumbai, Maharashtra- 400079</p>
                            </div>
                        </div>
                        <div className="loc_col">
                            <div className="upper_sec">
                                <h6>Chennai</h6>
                                <div className="icon">
                                    <Image src="/assets/icon/location_grad.svg" width="50" height="50" alt="Contact Icon"></Image>
                                </div>
                            </div>
                            <div className="details">
                                <p >#7, Fagun chambers, Door No.72/17(26/18), Ethiraj Salai, 3rd floor, South West Corner, Egmore, Chennai - 600105</p>
                            </div>
                        </div>
                        <div className="loc_col">
                            <div className="upper_sec">
                                <h6>Bangalore</h6>
                                <div className="icon">
                                    <Image src="/assets/icon/location_grad.svg" width="50" height="50" alt="Contact Icon"></Image>
                                </div>
                            </div>
                            <div className="details">
                                <p >12/3, G-2, HC Chambers, Infantry Road Cross, Bangalore - 560001</p>
                            </div>
                        </div>
                        <div className="loc_col">
                            <div className="upper_sec">
                                <h6>Hyderabad</h6>
                                <div className="icon">
                                    <Image src="/assets/icon/location_grad.svg" width="50" height="50" alt="Contact Icon"></Image>
                                </div>
                            </div>
                            <div className="details">
                                <p >Awfis Space Solutions Pvt Ltd, 4th Floor, Vasavi MPM Grand, Yella Reddy Guda Near Ameerpet Metro Station, Ameerpet, Hyderabad - 500073</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}