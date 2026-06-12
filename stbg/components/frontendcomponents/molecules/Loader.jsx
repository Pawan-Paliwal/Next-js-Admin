import Image from "next/image"

export default function Loader(){
    return(
        <div className="loader_wrap">
            <div className="center">
                <Image src="/assets/logo-vector.svg" width="100" height="100" alt="Logo" />
            </div>
        </div>
    )
}