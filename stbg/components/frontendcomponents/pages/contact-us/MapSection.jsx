

import Button from "@/components/frontendcomponents/atoms/Button";
import Image from "next/image";
import Link from "next/link";

export default function MapSection({ data }) {
  if (!data) return null;

  return (
    <section>
      <div className="map_section sec-pad-all">
        <div className="container">
          <div className="main_wrapper flex">
            <div className="details">
              <h4>Gurugram Headquarters</h4>
              <ul>
                {data.Address && data.MapDirection && (
                  <li>
                    <Link href={data.MapDirection} target="_blank">
                      <div className="icon">
                        <Image src="/assets/icon/location.svg" width="25" height="25" alt="Contact Icon"></Image>
                      </div>
                      <span>{data.Address}</span>
                    </Link>
                  </li>
                )}
                {data.PhoneNumber && (
                  <li>
                    <Link href={`tel:${data.PhoneNumber}`}>
                      <div className="icon">
                        <Image src="/assets/icon/call.svg" width="25" height="25" alt="Contact Icon"></Image>
                      </div>
                      <span>{data.PhoneNumber}</span>
                    </Link>
                  </li>
                )}
                {data.Email && (
                  <li>
                    <Link href={`mailto:${data.Email}`}>
                      <div className="icon">
                        <Image src="/assets/icon/mail.svg" width="25" height="25" alt="Contact Icon"></Image>
                      </div>
                      <span>{data.Email}</span>
                    </Link>
                  </li>
                )}
              </ul>
              {data.MapDirection && (
                <Button classname="top-right" buttonText="Get Direction" linkHref={data.MapDirection} target="_blank"></Button>
              )}
            </div>
            {data.IframeLink && (
              <div className="map">
                <iframe
                  src={data.IframeLink}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}