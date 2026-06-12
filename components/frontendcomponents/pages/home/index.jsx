"use client";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import LatestInsight from "./LatestInsight";
import Tour from "./Tour";
import KeyIndustries from "./KeyIndustries";
import Manufacturing from "./Manufacturing";
import Clients from "./Clients";
import Countries from "./Countries";
import Testimonial from "./Testimonial";
import { useGetHomePageDataQuery } from "@/store/frontendSlice/homePageAPISlice";
import Loading from "@/app/loading";
const Home = () => {
  const { data, isLoading, error } = useGetHomePageDataQuery();
    if (isLoading) return <Loading />;
  return (
    <>
      <Hero
        video="/video/intro.mp4"
        title="Advanced Manufacturing for Global Industries"
        navigation={{
          label: "Discover Our Capabilities",
          path: "/about-us",
        }}
        scrollTo="#industries"
        variant="secondary"
      />
      <KeyIndustries />
      <Countries />
      <Tour />
      {data?.partnerLogos?.length > 0 && <Clients clientData={data?.partnerLogos} />}
      {data?.manufacturing?.length > 0 && <Manufacturing manufacturingData={data?.manufacturing} />}
      {data?.blogs?.length > 0 && <LatestInsight blogData={data?.blogs} />}
      {data?.testimonials?.length > 0 && <Testimonial testimonialData={data?.testimonials} />}
    </>
  );
};

export default Home;