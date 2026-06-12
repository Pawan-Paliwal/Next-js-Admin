"use client"
import { useModalStore } from "@/store/modalStore";

export default function PoistionsCol({
    positionName = "",
    positionLoc = "",
    jobCategoryId = null,
    jobDescription = "",
    smallDescription = ""
}) {
    const openPositionsPop = useModalStore((state) => state.openPositionsPop);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPositionsPop({
            JobCategoryID: jobCategoryId,
            JobCategoryName: positionName,
            JobLocation: positionLoc,
            JobCategoryDescription: jobDescription,
            SmallDescription: smallDescription
        });
    }

    return (
        <div className="positons_col" onClick={handleClick}>
            <p className="pos_name">{positionName}</p>
            <p className="pos_loc">{positionLoc}</p>
            <button type="button" className="check_pos" onClick={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 1024 1024">
                    <path fill="currentColor" d="M768 256H353.6a32 32 0 1 1 0-64H800a32 32 0 0 1 32 32v448a32 32 0 0 1-64 0z"></path>
                    <path fill="currentColor" d="M777.344 201.344a32 32 0 0 1 45.312 45.312l-544 544a32 32 0 0 1-45.312-45.312z"></path>
                </svg>
            </button>
        </div>
    )
}