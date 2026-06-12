"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

import SlideBtn from "../atoms/SlideBtn";
import { Swiper, SwiperSlide } from "swiper/react";
import { useId } from "react";
import InsightCard from "./InsightCard";
import IndustryCard from "../pages/home/IndustryCard";
import ClientCard from "../pages/home/ClientCard";
import CountryName from "../pages/home/CountryName";
import FeaturedBlogCard from "../pages/blog/FeaturedBlogCard";
import DirerctorsCard from "../pages/about/DirerctorsCard";
import CompaniesGroupCard from "../pages/about/CompaniesGroupCard";
import AwardCard from "../pages/about/AwardCard";
import MileStoneCard from "../pages/about/MileStoneCard";
import MissionCard from "../pages/about/MissionCard";
import CollabrationCard from "../pages/about/CollabrationCard";
import ClientTestimonialCard from "../pages/client-testimonial/ClientTestimonialCard";
import TestimonialCard from "../pages/home/TestimonialCard";
import FacilityImageCard from "../pages/manufacturing/detail/FacilityImageCard";
import HighlightCard from "../pages/product/detail/HighlightCard";
import TechCard from "../pages/product/detail/TechCard";

const Slider = ({
  effect,
  card = "",
  data = [],
  breakpoints = {},
  spaceBetween = 16,
  speed = 900,
  creativeEffect,
  loop = false,
  slidesPerView = 1.2,
  direction = "horizontal",
  autoplay = {},
  centeredSlides = false,
  centeredSlidesBounds = false,
  paginationType,
  cardsEffect,
  className = "",
  isBtnVisible = true,
  navigation,
  modules = [],
  initialSlide,
  btnIconSize,
  btnVariant = "",
  cardVariant = "",
  btnPosition = "",
  freeMode = false,
  onSwiper,
  onSlideChange,
  loopAdditionalSlides = 0,
  name = "",
}) => {
  const id = useId();

  return (
    <div className="relative min-w-0 [&_.swiper-button-disabled]:hidden!">
      <Swiper
        loop={loop && data?.length > 1}
        slidesPerView={slidesPerView}
        breakpoints={breakpoints}
        spaceBetween={spaceBetween}
        speed={speed}
        autoplay={
          autoplay && typeof autoplay === "object"
            ? { pauseOnMouseEnter: true, ...autoplay }
            : autoplay !== false
              ? { pauseOnMouseEnter: true }
              : false
        }
        direction={direction}
        centeredSlides={centeredSlides}
        centeredSlidesBounds={centeredSlidesBounds}
        freeMode={freeMode}
        effect={effect}
        cardsEffect={cardsEffect}
        initialSlide={initialSlide}
        loopAdditionalSlides={loopAdditionalSlides}
        navigation={
          navigation ?? {
            prevEl: `.swiper-prev-${id}`,
            nextEl: `.swiper-next-${id}`,
          }
        }
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        pagination={{
          clickable: true,
          ...(paginationType && { type: paginationType }),
        }}
        modules={modules}
        className={className}
      >
        {data?.map((item, i) => (
          <SwiperSlide
            className={`flex! ${direction === "vertical" ? "" : "h-auto!"}`}
            key={i}
          >
            {card === "insight" ? (
              <InsightCard {...item} name={name} />
            ) : card === "industry" ? (
              <IndustryCard {...item} />
            ) : card === "client" ? (
              <ClientCard {...item} />
            ) : card === "country" ? (
              <CountryName>{item}</CountryName>
            ) : card === "recentInsight" ? (
              <FeaturedBlogCard {...item} />
            ) : card === "director" ? (
              <DirerctorsCard {...item} />
            ) : card === "company" ? (
              <CompaniesGroupCard {...item} />
            ) : card === "award" ? (
              <AwardCard {...item} />
            ) : card === "milestone" ? (
              <MileStoneCard {...item} />
            ) : card === "foundation" ? (
              <MissionCard {...item} />
            ) : card === "collabration" ? (
              <CollabrationCard {...item} />
            ) : card === "clientTestimonial" ? (
              <ClientTestimonialCard {...item} />
            ) : card === "testimonial" ? (
              <TestimonialCard {...item} />
            ) : card === "facility" ? (
              <FacilityImageCard item={item} />
            ) : card === "productHighlight" ? (
              <HighlightCard item={item} index={i} />
            ) : card === "techCard" ? (
              <TechCard {...item} />
            ) : (
              ""
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {isBtnVisible && (
        <>
          <SlideBtn
            variant={btnVariant}
            iconSize={btnIconSize}
            position={btnPosition}
            className={`swiper-prev-${id} swiper-button-prev`}
          />
          <SlideBtn
            variant={btnVariant}
            iconSize={btnIconSize}
            position={btnPosition}
            className={`swiper-next-${id} swiper-button-next`}
          />
        </>
      )}
    </div>
  );
};

export default Slider;
