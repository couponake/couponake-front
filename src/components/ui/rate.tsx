"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RateProps {
  count?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
  readOnly?: boolean;
}

export const Rate: React.FC<RateProps> = ({
  count = 5,
  defaultValue = 0,
  onChange,
  className,
  readOnly = false,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseEnter = (index: number) => {
    setHoverValue(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const handleClick = (index: number) => {
    if (readOnly) return;
    const newValue = index + 1;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      className={cn("flex", className)}
      onMouseLeave={handleMouseLeave}
      role="radiogroup"
      aria-label="Rate"
    >
      {[...Array(count)].map((_, index) => (
        <Star
          key={index}
          className={cn(
            "w-5 h-5 cursor-pointer transition-colors",
            index < (hoverValue || value)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300",
            readOnly && "cursor-default"
          )}
          onMouseEnter={!readOnly ? () => handleMouseEnter(index) : undefined}
          onClick={!readOnly ? () => handleClick(index) : undefined}
          role="radio"
          aria-checked={index < value}
          aria-posinset={index + 1}
          aria-setsize={count}
        />
      ))}
    </div>
  );
};
