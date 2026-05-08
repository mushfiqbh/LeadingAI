import { LucideIcon, ArrowRight } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  onClick?: () => void;
  icon?: LucideIcon;
  color?: "blue" | "purple" | "pink" | "green" | "orange";
  cta?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  onClick,
  icon: Icon,
  color = "blue",
  cta = "Open",
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer w-full min-h-[160px] rounded-2xl"
    >
      {/* Gradient Glow Border */}
      <div
        className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br opacity-60 blur-md group-hover:opacity-100 transition`}
      />

      {/* Glass Card */}
      <div
        className="
          relative h-full
          flex flex-col justify-between
          p-6 rounded-2xl
          backdrop-blur-xl bg-white/60
          border border-white/40
          shadow-lg shadow-black/5
          hover:-translate-y-2
          hover:shadow-xl hover:shadow-black/10
          active:scale-[0.98]
          transition-all duration-300
        "
      >
        {/* Top */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800 text-lg">
              {title}
            </h3>

            {Icon && (
              <div className="p-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 group-hover:scale-110 transition">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
