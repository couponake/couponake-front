import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const HeroLoadingUi = () => {
  return (
    <div className="flex items-center justify-center gap-8 overflow-x-hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "rounded-2xl h-full min-h-32 sm:min-h-50 md:min-h-64 min-w-80 w-full p-1",
            index !== 1 && "scale-90"
          )}
        />
      ))}
    </div>
  );
};

export default HeroLoadingUi;
