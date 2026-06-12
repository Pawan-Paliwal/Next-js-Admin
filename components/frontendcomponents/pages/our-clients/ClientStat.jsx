"use client";

import { motion } from "framer-motion";

const ClientStat = () => {
  return (
    <section id="detail" className="bg-background py-20">
      <div className="container">
        <p>
          Our clients span a wide range of industries, each with distinct
          challenges, expectations, and operational demands. We build strong,
          long-term partnerships by consistently delivering reliable,
          high-quality solutions tailored to their goals and performance
          standards. Every collaboration reflects our commitment to precision,
          consistency, and a deep understanding of complex industrial needs.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center py-8 md:py-0">
          {data?.map(({ title, stat }, idx) => {
            return (
              <motion.div
                key={idx}
                initial={{
                  marginRight: idx !== data.length - 1 ? -50 : 0,
                }}
                whileInView={{
                  marginRight: idx !== data.length - 1 ? 30 : 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.15,
                  ease: "easeOut",
                }}
                className={`relative z-[${idx + 1}] last:bg-primary flex h-65.75 w-65.75 flex-col items-center justify-center gap-2 rounded-full border border-[#D3D3D3] bg-white p-14 last:*:text-white md:gap-6 last:[&>p:last-child]:text-white/80`}
              >
                <p className="text-[40px] font-medium text-black">{stat}</p>
                <p className="text-center text-base leading-6">{title}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClientStat;

const data = [
  {
    title: "Worldwide Clients Served",
    stat: "150+",
  },
  {
    title: "Successful Projects Delivered",
    stat: "300+",
  },
  {
    title: "Diverse Industries Covered",
    stat: "20+",
  },
  {
    title: "Years of Experience",
    stat: "60+",
  },
];
