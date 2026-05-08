import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 text-sm w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
          ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input"
