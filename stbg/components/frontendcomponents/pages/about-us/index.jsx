"use client"
import ProductHeroSection from "@/components/frontendcomponents/molecules/ProductHeroSection"
import Milestone from "@/components/frontendcomponents/organisms/Milestone"
import MissionVission from "./MissionVission"
import TeamSec from "./TeamSec"
import TeamPop from "@/components/frontendcomponents/organisms/TeamPop"
import JourneySec from "./JourneySec"
import PositionsPop from "@/components/frontendcomponents/molecules/PositionsPop"
import { useGetAboutUsPageDataQuery } from "@/store/backendSlice/homeAPISlice"
import "@/uploads/styles/about/about.css"

export default function AboutUsPage() {
    const { data: aboutUs, isLoading } = useGetAboutUsPageDataQuery();
    const milestones = aboutUs?.milestones || [];
    const teamData = aboutUs?.team || {};
    const timelineData = aboutUs?.timelines || {};
    const coreLeadership = teamData["Core Leadership"] || [];
    const teamMembers = teamData["Team Member"] || [];
    const advisoryBoard = teamData["Advisory Board"] || [];


    const MilestoneData = milestones.map((item) => ({
        id: item.MilestoneID,
        title: item.Title,
        description: item.Description,
        image: item.MilestoneImage
            ? `/OnlineImages/MilestoneImages/${item.MilestoneImage}`
            : "/assets/images/home/trophy.png",
    }));

    return (
        <main>
            <ProductHeroSection
                classname="about_us"
                heading={<>Building a Healthier Future Through<span> Trust and Innovation</span></>}
                subHeading="Founded on the principle that cost should not be a barrier to care, the organization creates sustainable financial ecosystems that empower hospitals, support corporate teams, and ensure health certainty for every individual."
                mediaType="photo"
                mediaSrc="/assets/images/about/about-us.jpg"
            />
             <JourneySec TimelineData={timelineData} />
            <MissionVission />
            {coreLeadership.length > 0 && (
                <TeamSec
                    heading={<>Core Leadership: <span>Expertise Meets Execution</span></>}
                    teamData={coreLeadership}
                />
            )}

{advisoryBoard.length > 0 && (
                <TeamSec
                    classname="advisory_board"
                    heading={<>Advisory <span>Board</span></>}
                    teamData={advisoryBoard}
                />
            )}

            {teamMembers.length > 0 && (
                <TeamSec
                    classname="second_team"
                    heading={<>The Team Building <span>A Healthier Future</span></>}
                    teamData={teamMembers}
                />
            )}
            
            {MilestoneData.length > 0 && (
                <Milestone
                    classname="about_us"
                    heading={<>Milestones That Defined <span>Our Innovative Path</span></>}
                    MilestoneData={MilestoneData}
                />
            )}
            <TeamPop />
            <PositionsPop />
        </main>
    )
}
