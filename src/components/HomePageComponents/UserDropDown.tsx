"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { useTranslations } from "next-intl";
import { HeartIcon, LogOut, UserIcon } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { logout } from "@/lib/utils";

const UserDropDown = () => {
  const { user } = useStore((store) => store);
  const t = useTranslations();

  return (
    <Dropdown
      showArrow
      radius="sm"
      classNames={{
        base: "before:bg-default-200 min-w-64",
        content: "p-0 border-small  border-divider font-inherit bg-background",
      }}
    >
      <DropdownTrigger>
        <Button
          size="md"
          className="rounded-full"
          variant="flat"
          startContent={<UserIcon className="size-5" />}
        >
          <p className="truncate max-w-18">
            {user?.name}
          </p>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        className="p-3"
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-gray-800",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
      >
        <DropdownSection aria-label="Profile & Actions" showDivider>
          <DropdownItem isReadOnly key="profile" className="opacity-100">
            <div className="flex items-center gap-4 pb-3">
              {user && <Avatar size="md" src={user?.image} />}
              <p className="text-gray-800 truncate max-w-35">{user?.name}</p>
            </div>
          </DropdownItem>
          <DropdownItem
            key="user_profile"
            href="/profile"
            as={Link}
            className="py-2.5"
            endContent={<UserIcon className="size-5" />}
          >
            {t("My Account")}
          </DropdownItem>
          {/* <DropdownItem
            key="notifications"
            href="/notifications"
            className="py-2.5"
            as={Link}
            endContent={<BellIcon className="size-5" />}
          >
            {t("Notifications")}
          </DropdownItem> */}
          <DropdownItem
            key="favorites"
            href="/profile/favorites"
            as={Link}
            className="py-2.5"
            endContent={<HeartIcon className="size-5" />}
          >
            {t("Favorites")}
          </DropdownItem>
        </DropdownSection>

        <DropdownItem
          key="logout"
          onPress={logout}
          className="!text-danger hover:!bg-red-600/20"
          color="primary"
          endContent={<LogOut className="size-5" />}
        >
          {t("auth.logout")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserDropDown;
