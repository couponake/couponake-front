"use client";
import { cn } from "@/lib/utils";
import { Responsibile } from "@/types";
import { CircleUser } from "lucide-react";
import React, { useState } from "react";

import ShowAuthorDetails from "../Modals/ShowAuthorDetails";

const Author = ({
  author,
  storeName,
}: {
  author: Responsibile;
  storeName: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);

  const openResponsibleDrawer = () => {
    setIsDrawerOpened(true);
  };

  const getResponseDrawer = () => {
    setIsOpen(false);
    openResponsibleDrawer();

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", `${storeName}_responsible`, {
        event_category: `${storeName}_responsible`,
        author_id: author?.id,
        author_name: author?.name,
      });
    }
  };

  return (
    <>
      <button
        name="author"
        title="author"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={getResponseDrawer}
        className={cn(
          "bg-white w-max shadow fixed top-40 flex-row-reverse z-[100] rounded-e-md transition-all ease-in-out duration-300 text-main-500 py-2 px-3 flex items-center gap-3",
          isOpen && "rtl:!right-0 ltr:!left-0"
        )}
      >
        <CircleUser className="size-7" />
        {isOpen ? <p>{author?.name}</p> : ""}
      </button>

      <ShowAuthorDetails
        author={author}
        openDrawer={isDrawerOpened}
        onClose={() => setIsDrawerOpened(!isDrawerOpened)}
      />
    </>
  );
};

export default Author;
