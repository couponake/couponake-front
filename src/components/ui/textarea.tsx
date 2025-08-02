"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Label as ShadLabel } from "@/components/ui/label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  type?: string;
  label?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  alignToRight?: boolean;
  classNames?: {
    startContent?: string;
    endContent?: string;
    description?: string;
    label?: string;
    main?: string;
    wrapper?: string;
  };
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      type,
      startContent,
      label,
      endContent,
      description,
      required,
      alignToRight,
      classNames,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("rtl:text-right", classNames?.main)}>
        {label && (
          <ShadLabel
            className={cn("max-sm:text-sm text-gray-800", classNames?.label)}
          >
            {label} {required && <span className="text-red-600">*</span>}
          </ShadLabel>
        )}
        <div
          dir={alignToRight ? "rtl" : "auto"}
          className={cn(
            "flex items-center relative mt-2 rounded border-1 hover:border-main-400 transition text-gray-500 bg-gray-100",
            classNames?.wrapper
          )}
        >
          {startContent && (
            <div
              className={cn(
                "flex items-center rtl:mr-3 ltr:ml-3",
                classNames?.startContent
              )}
            >
              {startContent}
            </div>
          )}
          <textarea
            className={cn(
              "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          {endContent && (
            <div
              className={cn(
                "flex items-center rtl:ml-3 ltr:mr-3",
                classNames?.endContent
              )}
            >
              {endContent}
            </div>
          )}
        </div>
        <div
          className={cn(
            "mt-1.5 text-xs text-gray-500",
            classNames?.description
          )}
        >
          {description}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
