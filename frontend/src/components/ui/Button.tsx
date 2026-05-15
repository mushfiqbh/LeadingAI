import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "success" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles =
      "cursor-pointer inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-black text-white hover:bg-zinc-800",
      outline:
        "border border-zinc-600 bg-zinc-900 text-zinc-100 hover:bg-zinc-800",
      success: "bg-green-600 text-white hover:bg-green-700",
      ghost:
        "bg-transparent hover:bg-zinc-800 text-zinc-100",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className} px-4 py-2`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
