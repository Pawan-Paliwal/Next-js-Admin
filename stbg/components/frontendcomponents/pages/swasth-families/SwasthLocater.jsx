export default function SwasthLocater(){
    return (
        <section>
            <div className="swasth-secE sec-pad-all">
                <div className="container">
                <div className="heading">
                    <h2>
                    Swasth Membership <span>Enrollment and Hospital Locator</span>
                    </h2>
                </div>
                <div className="locater_wrapper">
                    <div className="loc_nav">
                    <div className="input_wrapper">
                        <input
                        type="text"
                        className="form-input"
                        placeholder="Enter your City, PIN code, or Address..."
                        />
                        <button type="button" className="loc_btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18px"
                            height="18px"
                            viewBox="0 0 24 24"
                        >
                            <path
                            fill="currentColor"
                            d="M11 21.95v-1q-3.125-.35-5.363-2.587T3.05 13h-1q-.425 0-.712-.288T1.05 12t.288-.712T2.05 11h1q.35-3.125 2.588-5.363T11 3.05v-1q0-.425.288-.712T12 1.05t.713.288t.287.712v1q3.125.35 5.363 2.588T20.95 11h1q.425 0 .713.288t.287.712t-.287.713t-.713.287h-1q-.35 3.125-2.587 5.363T13 20.95v1q0 .425-.288.713T12 22.95t-.712-.287T11 21.95M12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16"
                            ></path>
                        </svg>{" "}
                        Use my current location
                        </button>
                    </div>
                    <button type="button" className="btn">
                        Search
                    </button>
                    </div>
                    <div className="map_sec">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14036.76680369011!2d77.072231!3d28.4134719!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d23fa3cf17213%3A0xf4533d0aee13b674!2sPrettify%20Creative%20%7C%20Graphic%20Designer%20Gurgaon%20%7C%20Logo%20Designer%20in%20Gurgaon%20%7C%20Web%20Designer%20in%20Gurgaon!5e0!3m2!1sen!2sin!4v1729250877739!5m2!1sen!2sin"
                            width="100%"
                            height="600"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}