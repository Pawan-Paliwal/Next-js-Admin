"use client";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import TrunkeyList from "./TrunkeyList";
import { useGetTurnkeyProjectQuery } from "@/store/backendSlice/clientTypeAPISlice";
import Loading from "@/app/loading";

const TrunkeySolution = () => {
  const { data: turnkeyCategorydata, isLoading, isSuccess } = useGetTurnkeyProjectQuery();
   if (isLoading) return <Loading />;
  return (
    <>
      <Hero
        video="/video/trunkey-hero.mp4"
        title="Turnkey Solutions "
        description="Engineering Turnkey Execution -Taking Projects from Blueprint to Fully Operational Facility."
        scrollTo="#turnkey-solution"
      />
      {turnkeyCategorydata?.turnkeycategory?.length > 0 && (
        <TrunkeyList data={turnkeyCategorydata.turnkeycategory || []} />
      )}
    </>
  );
};
export default TrunkeySolution;
