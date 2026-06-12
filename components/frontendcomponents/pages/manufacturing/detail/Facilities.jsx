"use client";
import Slider from "@/components/frontendcomponents/molecules/Slider";
import { Autoplay, Pagination } from "swiper/modules";

const Facilities = ({ products = [] }) => {
  const data = products.map((item) => ({
    title: item.ProductName,
    images: [
      item.FacilityDefaultImage,
      item.FacilityOtherImage1,
      item.FacilityOtherImage2,
      item.FacilityOtherImage3,
    ]
      .filter(Boolean)
      .map((img) => `/OnlineImages/FacilityproductImages/${img}`),
    description: item.Description,
  }));

  return (
    <section className="bg-background">
      <div className="container">
        {data.map(({ title, images, description }, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={i}
              className="before:bg-primary relative pt-16 pl-18! before:absolute before:top-0 before:bottom-0 before:left-0 before:h-full before:w-px before:content-[''] last:pb-16"
            >
              <h3 className="text-gray before:border-primary before:bg-background relative text-xl leading-[26px] font-medium before:absolute before:-left-[84px] before:size-[24px] before:rounded-full before:border before:content-['']">
                {title}
              </h3>
              <div className={`mt-10 grid gap-16 ${isEven ? "grid-cols-[407px_1fr]" : "grid-cols-[1fr_407px]"}`}>
                <div className={`${isEven ? "order-1" : "order-2"} min-w-0`}>
                  <Slider
                    isBtnVisible={false}
                    loop={true}
                    data={images}
                    slidesPerView={1}
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 2000, disableOnInteraction: true }}
                    pagination={{ clickable: true }}
                    card="facility"
                    className="overflow-hidden rounded-md bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] [&_.swiper-pagination]:static! [&_.swiper-pagination]:py-2"
                  />
                </div>
                <div className={`h-fit overflow-hidden rounded-md ${isEven ? "order-2" : "order-1"}`}>
                  <div
                    className="[&_table]:w-full [&_table]:text-left [&_td]:border [&_td]:border-[#DADADA] [&_td]:px-5 [&_td]:py-3.5 [&_td]:text-sm [&_th]:px-5 [&_th]:py-4 [&_th]:font-normal [&_thead]:bg-primary [&_thead]:leading-[20px] [&_thead]:text-white [&_tbody_tr]:odd:bg-white"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Facilities;