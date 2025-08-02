import React from "react";
import { cn } from "@/lib/utils";
import { Label as ShadLabel } from "@/components/ui/label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  label?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  // alignToRight?: boolean;
  isLoading?: boolean;
  classNames?: {
    startContent?: string;
    endContent?: string;
    description?: string;
    label?: string;
    wrapper?: string;
    main?: string;
  };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startContent,
      label,
      endContent,
      isLoading,
      description,
      required,
      // alignToRight,
      classNames,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("rtl:text-right w-full", classNames?.main)}>
        {label && (
          <ShadLabel
            className={cn(
              "max-sm:text-sm block text-gray-800",
              classNames?.label
            )}
          >
            {label} {required && <span className="text-red-600">*</span>}
          </ShadLabel>
        )}
        <div
          className={cn(
            "flex items-center relative rounded-lg border-1 hover:border-main-400 transition text-gray-500 bg-gray-100",
            classNames?.wrapper,
            label && "mt-2"
          )}
        >
          {startContent && (
            <div
              className={cn("flex items-center ms-3", classNames?.startContent)}
            >
              {startContent}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex min-h-11 w-full px-3 py-2 text-sm rounded-lg placeholder:text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-main-50 file:text-main-600 hover:file:bg-main-100 focus-visible:outline-none text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100",
              className
            )}
            ref={ref}
            {...props}
          />
          {isLoading && (
            <svg
              className="animate-spin me-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          )}
          {!isLoading && endContent && (
            <div
              className={cn("flex items-center me-3", classNames?.endContent)}
            >
              {endContent}
            </div>
          )}
        </div>
        {description && (
          <div
            className={cn(
              "mt-1.5 text-xs text-gray-500",
              classNames?.description
            )}
          >
            {description}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
