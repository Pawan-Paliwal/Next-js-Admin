import Image from "next/image";
import React from "react";

const PolicyNote = ({ content }) => {
  return (
    <section className="bg-primary relative overflow-hidden py-16" >
      <Image
        src="/vector/icon.svg"
        alt="icon"
        width={254}
        height={254}
        className="absolute -bottom-20 -right-20"
      />

      <div className="container">
        <div className="flex items-center gap-10">
          <figure>
            <Image
              src="/icon/shield-white.svg"
              alt="shield"
              width={133}
              height={133}
            />
          </figure>
          <figcaption className="text-white">{content}</figcaption>
        </div>
      </div>
    </section>
  );
};

export default PolicyNote;
