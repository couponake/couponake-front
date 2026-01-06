"use client";
import { MenuItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StickyMenu({
  menus,
}: {
  menus: MenuItem[] | null | undefined;
}) {
  const path = usePathname();

  if (!menus || menus.length === 0) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/70 backdrop-blur-xl border-t lg:hidden z-40">
      <div className="flex justify-around items-center h-16">
        {menus?.map((menuItem, index) => (
          <Link
            target="_self"
            key={index}
            href={menuItem.url}
            className={`flex flex-col items-center justify-center flex-1 h-full ${menuItem.url === path ? "text-primary" : "text-default-600"
              }`}
          >
            {/* <span className="text-xl mb-1">
                    {menuItem.icon && <menuItem.icon size={20} />}
                  </span> */}
            <span className="text-sm">{menuItem.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
