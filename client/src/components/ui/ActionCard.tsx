import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  onClick?: () => void;
  icon?: LucideIcon;
  color?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  onClick,
  icon: Icon,
  color = "blue",
}) => {
  const colorVariants: { [key: string]: string } = {
    blue: "border-l-blue-500 hover:bg-blue-50/30",
    purple: "border-l-purple-500 hover:bg-purple-50/30",
    orange: "border-l-orange-500 hover:bg-orange-50/30",
    green: "border-l-green-500 hover:bg-green-50/30",
    indigo: "border-l-indigo-500 hover:bg-indigo-50/30",
    rose: "border-l-rose-500 hover:bg-rose-50/30",
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between items-start text-left w-full min-h-[140px] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 border-l-4 group cursor-pointer bg-white ${colorVariants[color] || colorVariants.blue}`}
    >
      <div className="space-y-2 w-full">
        <div className="flex justify-between items-start w-full">
          <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          {Icon && (
            <div className={`p-2 rounded-xl bg-gray-50 group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 font-medium line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default ActionCard;
