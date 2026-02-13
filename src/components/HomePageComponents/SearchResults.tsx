"use client";
import { SearchResult } from "@/types";
import { ArrowUpRight, SearchXIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { FixedSizeList as List } from "react-window";
import { useRouter } from "next/navigation";

const SearchResults = ({
  results,
  onClose,
}: {
  results: SearchResult[] | null;
  onClose: () => void;
}) => {
  const t = useTranslations();
  const router = useRouter();

  const handleLinkClick = async (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="relative isolate">
      <div
        className="fixed inset-0 bg-black/50 top-17 sm:top-21 md:top-22 z-10"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal={true}
        aria-label="Search Results Modal"
        className="fixed min-w-[411px] sm:min-w-[511px] top-24 max-h-[87vh] inset-0 z-[90] bg-white max-w-[37vw] mx-auto rounded-xl p-4"
      >
        <Button
          onPress={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-4"
          isIconOnly
          size="sm"
          radius="full"
        >
          <XIcon className="size-4" />
        </Button>

        <ul className="max-h-full">
          {results && results.length > 0 ? (
            <List
              height={731}
              itemCount={results?.length || 0}
              itemSize={93}
              width="100%"
              className="scrollbar mt-5"
            >
              {({ index, style }) => {
                const href =
                  results[index]?.type === "store"
                    ? `/store/${results[index]?.slug}`
                    : results[index]?.type === "blog"
                      ? `/${results[index]?.id}`
                      : `/coupon-category/${results[index]?.slug}`;

                return (
                  <li
                    key={index + 1}
                    style={style}
                    className="!min-h-[93px] h-full"
                    dir="auto"
                  >
                    <div
                      onClick={() => handleLinkClick(href)}
                      className="flex items-center p-4 border-b border-b-gray-200 hover:bg-gray-100 transition-all group cursor-pointer"
                      aria-labelledby={`result-title-${results[index].id}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar
                          src={results[index]?.image}
                          alt={results[index]?.title}
                          name={results[index]?.title}
                          showFallback
                          size="md"
                        />
                        <h2
                          className="text-base font-bold text-gray-800"
                          id={`result-title-${results[index].id}`}
                        >
                          {results[index]?.store_name}
                        </h2>
                      </div>
                      <ArrowUpRight className="text-gray-500 group-hover:rotate-[45deg] transition-all" />
                    </div>
                  </li>
                );
              }}
            </List>
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <SearchXIcon className="mb-2 size-15 md:size-20 text-red-500/70" />
              <p className="text-center text-gray-600">{t("noResults")}</p>
              <p className="text-center text-gray-500">{t("refineSearch")}</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchResults;
