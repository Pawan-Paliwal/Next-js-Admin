import Image from "next/image";

const FacilityImageCard = ({ item }) => {
  return (
    <figure className="h-full w-full">
      <Image
        className="size-full"
        src={item}
        alt="machine"
        width={1920}
        height={1080}
      />
    </figure>
  );
};

export default FacilityImageCard;
