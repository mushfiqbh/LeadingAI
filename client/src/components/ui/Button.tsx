import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles =
      "cursor-pointer inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-black text-white hover:bg-zinc-800",
      outline:
        "border border-zinc-300 bg-white text-black hover:bg-zinc-100",
      ghost:
        "bg-transparent hover:bg-zinc-100 text-black",
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
