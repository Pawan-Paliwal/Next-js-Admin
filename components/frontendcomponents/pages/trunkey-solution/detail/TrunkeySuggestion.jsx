import Image from "next/image";
import Link from "next/link";
import React from "react";

const TrunkeySuggestion = ({ turnkeyProject }) => {
  return (
    <section className="bg-background py-20">
      <div className="container grid grid-cols-2 gap-20">
        <div>
          <ul>
            {other?.map((item, index) => (
              <li
                className="border-b border-[#00000033] pb-9 not-last:mb-9"
                key={index}
                href="#"
              >
                <Link
                  className="group relative inline-block w-full text-2xl font-semibold text-black/40"
                  href={`/turnkey-projects/${item.toLowerCase().replace(" ", "-")}`}
                >
                  {item}
                  <figure className="flex-center absolute top-0 right-0 size-9.75 rounded-full border border-[#00000066] transition-all duration-300 ease-in-out group-hover:rotate-45">
                    <Image
                      src="/icon/linear.svg"
                      alt="arrow"
                      width={22}
                      height={22}
                    />
                  </figure>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: turnkeyProject?.ProductDescription }} />
        </div>
      </div>
    </section>
  );
};

export default TrunkeySuggestion;

const other = [
  "Rotary Kiln Cement Plant ",
  "Vertical Shaft Kiln Cement Plant ",
  "Clinker Grinding Units",
];
