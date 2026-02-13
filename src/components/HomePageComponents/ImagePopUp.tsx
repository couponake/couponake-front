"use client";
import React, { useEffect, useState } from "react";
import { SettingsItem } from "@/types";
import { usePathname } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Image } from "@heroui/image";

const ImagePopUp = ({
  settings,
}: {
  settings: SettingsItem[] | null | undefined;
}) => {
  const popup_location = settings?.find(
    (item) => item.name === "popup_location"
  )?.val;
  const popup_image = settings?.find(
    (item) => item.name === "popup_image"
  )?.val;
  const popup_url = settings?.find((item) => item.name === "popup_url")?.val;

  // Check if the popup has been closed before or if content has changed
  const [shouldShowPopup, setShouldShowPopup] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const popupClosed = localStorage.getItem("popupClosed");
      const storedImageUrl = localStorage.getItem("popupImageUrl");
      const storedPopupUrl = localStorage.getItem("popupUrl");
      // Show popup if it was never closed or if content has changed
      if (
        popupClosed !== "true" ||
        storedImageUrl !== popup_image ||
        storedPopupUrl !== popup_url
      ) {
        setShouldShowPopup(true);
      }
    }
  }, [popup_image, popup_url]);

  const onOpenChange = () => {
    setShouldShowPopup(!shouldShowPopup);
  };

  // Handle popup close and store in localStorage
  const handleOpenChange = (open: boolean) => {
    onOpenChange();
    if (!open) {
      localStorage.setItem("popupClosed", "true");
      // Store current popup content values for future comparison
      localStorage.setItem("popupImageUrl", popup_image ?? "");
      localStorage.setItem("popupUrl", popup_url ?? "");
    }
  };

  const pathname = usePathname();
  if (!popup_location) {
    return null;
  }

  const locations = JSON.parse(popup_location) as string[];
  // Check if current pathname matches any location
  if (
    !locations.some((location) => {
      // Check if location is /store/ and pathname includes /store/
      if (location === "/store/") {
        return pathname.includes("/store/");
      }
      // For other locations, check for exact match
      return pathname === location;
    })
  ) {
    return null;
  }

  return (
    <Modal
      isOpen={shouldShowPopup}
      onOpenChange={handleOpenChange}
      size="2xl"
      classNames={{
        wrapper: "items-center",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader />
            <ModalBody className="flex items-center justify-center">
              <a
                href={popup_url ?? ""}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="nofollow"
                className="block"
                onClick={onClose}
              >
                <Image
                  src={popup_image ?? ""}
                  alt="Popup Image"
                  className="w-full h-auto object-contain"
                />
              </a>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImagePopUp;
