"use client"
import Image from "next/image";
import { useModalStore } from "@/store/modalStore";
import "@/uploads/styles/component/component.css"

export default function TeamCol({ imgSrc = "", name = "", designation = "", bio = "", teamId = null }) {
    const openTeamPop = useModalStore((state) => state.openTeamPop)
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!bio || bio.trim() === "") return;
        openTeamPop({
            TeamImage: imgSrc,
            TeamName: name,
            TeamDesignation: designation,
            TeamBio: bio,
            TeamID: teamId
        });
    }

    return (
        <div className={`team_col ${!bio || bio.trim() === "" ? "no_cursor" : ""}`} onClick={handleClick} >
            <figure>
                <Image src={imgSrc} width="320" height="360" alt="Team Image"></Image>
            </figure>
            <figcaption>
                <div className="mem_details">
                    <h6 className="name">{name}</h6>
                    <p className="desg">{designation}</p>
                </div>
                {bio && bio.trim() !== "" && (
                    <button type="button" className="moreBtn" onClick={handleClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 1024 1024">
                            <path fill="currentColor" d="M768 256H353.6a32 32 0 1 1 0-64H800a32 32 0 0 1 32 32v448a32 32 0 0 1-64 0z"></path>
                            <path fill="currentColor" d="M777.344 201.344a32 32 0 0 1 45.312 45.312l-544 544a32 32 0 0 1-45.312-45.312z"></path>
                        </svg>
                    </button>
                )}
            </figcaption>
        </div>
    )
}