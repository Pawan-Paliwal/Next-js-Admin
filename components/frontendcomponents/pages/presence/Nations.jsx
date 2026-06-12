import Heading from "@/components/frontendcomponents/atoms/Heading";
import Image from "next/image";
import React from "react";

const Nations = () => {
  function generateFlag(flag, name) {
    return (
      <figure className="h-[30px] w-[40px] overflow-hidden rounded-sm">
        <Image
          className="shrink-0 object-cover"
          src={`https://flagcdn.com/40x30/${flag}.png`}
          alt={name}
          width={40}
          height={30}
        />
      </figure>
    );
  }

  return (
    <section className="bg-primary py-20">
      <div className="container">
        <Heading className="text-center text-white">
          Worldwide Footprints
        </Heading>

        <ul className="mt-14 grid grid-cols-6 gap-5">
          {data?.map(({ name, code }, i) => {
            return (
              <li className="flex items-center   gap-4" key={i}>
                {generateFlag(code.toLowerCase(), name)}
                <span className="text-sm font-medium text-white">{name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Nations;

const data = [
  { name: "India", code: "IN" },
  { name: "USA", code: "US" },
  { name: "Colombia", code: "CO" },
  { name: "Bolivia", code: "BO" },
  { name: "Senegal", code: "SN" },
  { name: "Rwanda", code: "RW" },
  { name: "Botswana", code: "BW" },

  { name: "Zambia", code: "ZM" },
  { name: "Romania", code: "RO" },
  { name: "Guyana", code: "GY" },
  { name: "Tanzania", code: "TZ" },
  { name: "UAE", code: "AE" },
  { name: "Sudan", code: "SD" },
  { name: "Kenya", code: "KE" },

  { name: "Myanmar", code: "MM" },
  { name: "Singapore", code: "SG" },
  { name: "Bhutan", code: "BT" },
  { name: "Slovakia", code: "SK" },
  { name: "Finland", code: "FI" },
  { name: "Nepal", code: "NP" },
  { name: "Bangladesh", code: "BD" },

  { name: "Egypt", code: "EG" },
  { name: "Djibouti", code: "DJ" },
  { name: "United Kingdom", code: "GB" },
  { name: "Thailand", code: "TH" },
  { name: "Malaysia", code: "MY" },
  { name: "South Africa", code: "ZA" },
  { name: "Vietnam", code: "VN" },

  { name: "Congo (DRC)", code: "CD" },
  { name: "Yemen", code: "YE" },
  { name: "Malawi", code: "MW" },
  { name: "Nigeria", code: "NG" },
  { name: "Japan", code: "JP" },
  { name: "Kuwait", code: "KW" },
  { name: "Oman", code: "OM" },

  { name: "Czech Republic", code: "CZ" },
  { name: "Mali", code: "ML" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
  { name: "Côte d’Ivoire", code: "CI" },
  { name: "Italy", code: "IT" },
  { name: "Niger", code: "NE" },
];
