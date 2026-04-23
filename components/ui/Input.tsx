import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightElement, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 flex items-center text-gray-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-lg border border-gray-200 bg-gray-50 py-3 text-sm text-gray-900 placeholder:text-gray-400",
              "transition-colors duration-150",
              "focus:outline-none focus:border-[#1B3FA6] focus:bg-white focus:ring-2 focus:ring-[#1B3FA6]/10",
              error && "border-red-400 focus:border-red-400 focus:ring-red-100",
              leftIcon ? "pl-10" : "pl-4",
              rightElement ? "pr-11" : "pr-4",
              className
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3.5 flex items-center">
              {rightElement}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
