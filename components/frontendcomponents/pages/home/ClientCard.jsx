import Image from "next/image";

const ClientCard = ({ image }) => {
  return (
    <figure className="flex-center p-10 h-[70px] md:h-[112.5px] w-full overflow-hidden rounded-md bg-white">
      <Image src={image} alt={image} width={500} height={500} />
    </figure>
  );
};

export default ClientCard;
