import { StaticImageData } from "next/image";
import Image from "next/image";

interface ActionCardProps {
  title: string;
  description: string;
  image: StaticImageData;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  image,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative flex flex-col justify-center items-start text-left w-full h-32 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group cursor-pointer overflow-hidden bg-gradient-to-r from-white to-gray-200"
    >
      <div className="absolute right-0 top-0 bottom-0 w-3/5 h-full mix-blend-normal">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover [mask-image:linear-gradient(to_right,transparent,black)]"
          priority
        />
      </div>

      <div className="relative z-10 max-w-[65%]">
        <h3 className="font-bold mb-1 text-lg">{title}</h3>
        <p className="text-sm text-gray-700 font-medium">{description}</p>
      </div>
    </div>
  );
};

export default ActionCard;
