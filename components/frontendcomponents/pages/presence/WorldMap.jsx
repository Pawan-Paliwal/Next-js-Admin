import Image from "next/image";
import React from "react";

const WorldMap = () => {
  return (
    <section className="bg-background py-16">
      <div className="container">
        <figure className="relative mx-auto size-fit">
          <Image
            src="/vector/world-map.svg"
            alt="world-map"
            width={940}
            height={465}
          />

          {points.map((point, i) => (
            <div
              key={i}
              className="group absolute cursor-pointer"
              style={{
                top: point.top,
                left: point.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span className="animate-scale-pulse bg-primary inline-block size-[11px] rounded-full transition-all duration-500"></span>
              <p className="bg-primary before:border-t-primary absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded-full px-4 py-[2px] text-xs text-nowrap text-white transition-all duration-500 group-hover:scale-100 before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:content-['']">
                {point.name}
              </p>
            </div>
          ))}
        </figure>
      </div>
    </section>
  );
};

export default WorldMap;

const points = [
  { name: "USA", code: "US", top: "28%", left: "13%" },

  { name: "Colombia", code: "CO", top: "64%", left: "22%" },
  { name: "Bolivia", code: "BO", top: "68%", left: "26%" },
  { name: "Guyana", code: "GY", top: "60%", left: "27%" },

  { name: "United Kingdom", code: "GB", top: "26%", left: "47%" },
  // { name: "Germany", code: "DE", top: "33%", left: "50%" },
  // { name: "Italy", code: "IT", top: "38%", left: "49%" },
  // { name: "Romania", code: "RO", top: "34%", left: "53%" },
  // { name: "Slovakia", code: "SK", top: "32%", left: "52%" },
  // { name: "Czech Republic", code: "CZ", top: "31%", left: "49%" },
  { name: "Finland", code: "FI", top: "27%", left: "53%" },

  { name: "Senegal", code: "SN", top: "46%", left: "42%" },
  { name: "Mali", code: "ML", top: "48%", left: "50%" },
  // { name: "Niger", code: "NE", top: "58%", left: "48%" },
  // { name: "Nigeria", code: "NG", top: "60%", left: "47%" },
  // { name: "Côte d’Ivoire", code: "CI", top: "62%", left: "44%" },

  // { name: "Sudan", code: "SD", top: "42%", left: "57%" },
  { name: "Rwanda", code: "RW", top: "55%", left: "58%" },
  // { name: "Kenya", code: "KE", top: "48%", left: "60%" },
  { name: "Tanzania", code: "TZ", top: "69%", left: "53%" },
  // { name: "Djibouti", code: "DJ", top: "45%", left: "63%" },
  { name: "Congo (DRC)", code: "CD", top: "56%", left: "53%" },
  { name: "Zambia", code: "ZM", top: "62%", left: "55%" },
  { name: "Malawi", code: "MW", top: "69%", left: "57%" },
  { name: "Botswana", code: "BW", top: "75%", left: "55%" },
  { name: "South Africa", code: "ZA", top: "79%", left: "53%" },

  { name: "Egypt", code: "EG", top: "42%", left: "60%" },
  // { name: "UAE", code: "AE", top: "45%", left: "68%" },
  // { name: "Oman", code: "OM", top: "48%", left: "70%" },
  // { name: "Yemen", code: "YE", top: "50%", left: "69%" },
  // { name: "Kuwait", code: "KW", top: "42%", left: "67%" },

  { name: "Nepal", code: "NP", top: "40%", left: "71%" },
  { name: "Myanmar", code: "MM", top: "43%", left: "76%" },
  { name: "India", code: "IN", top: "44%", left: "70%" },

  { name: "Thailand", code: "TH", top: "48%", left: "79%" },
  // { name: "Thailand", code: "TH", top: "50%", left: "80%" },
  // { name: "Vietnam", code: "VN", top: "48%", left: "82%" },
  // { name: "Malaysia", code: "MY", top: "55%", left: "82%" },
  { name: "Singapore", code: "SG", top: "58%", left: "83%" },

  { name: "Japan", code: "JP", top: "50%", left: "85%" },

  { name: "Australia", code: "AU", top: "75%", left: "85%" },
];
