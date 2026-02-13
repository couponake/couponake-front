"use client";
import React, { useEffect, useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchResults from "../HomePageComponents/SearchResults";
import { useDebounce } from "@uidotdev/usehooks";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "@/components/ui/custom-toast";
import { SearchResult } from "@/types";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import api from "@/lib/api";

const SearchInput = () => {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useQueryState("filter", parseAsString);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  const getSearchResults = async () => {
    setIsSearching(true);
    try {
      const data = await api.request.post(`filter`, {
        search: debouncedSearchTerm,
      });
      if (data.success) {
        setResults(data.results);
        trackSearch(
          debouncedSearchTerm as string,
          data.results?.length ?? 0
        );
      }
    } catch (error: any) {
      if (error.response) {
        // If the server returns a specific error, nothing to do here.
        // toast.error(error.response.data.message || "An error occurred.");
      } else {
        toast.error("Unable to connect to the server.");
      }
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setResults(null);
  };

  useEffect(() => {
    const searchHN = async () => {
      if (debouncedSearchTerm?.trim()) {
        await getSearchResults();
      }
    };

    searchHN();
  }, [debouncedSearchTerm]);

  const trackSearch = (
    term: string,
    resultsCount: number
  ) => {
    if (typeof window === "undefined") return;

    (window as any).gtag?.("event", "view_search_result", {
      search_term: term,
      results_count: resultsCount,
      search_location: "header",
    });
  };

  return (
    <>
      <Input
        startContent={<SearchIcon className="size-5" />}
        placeholder={t("search_here")}
        value={(searchQuery as string) ?? ""}
        className="px-2"
        classNames={{
          wrapper: "border-[1px] border-gray-200",
        }}
        isLoading={isSearching}
        endContent={
          <>
            <Button
              onPress={handleClearSearch}
              variant="flat"
              size="sm"
              isIconOnly
              radius="full"
              className={` ${searchQuery ? "visible" : "invisible"}`}
            >
              <XIcon className="size-4" />
            </Button>
          </>
        }
        onChange={handleSearchChange}
      />
      {results && debouncedSearchTerm && (
        <SearchResults onClose={handleClearSearch} results={results} />
      )}
    </>
  );
};

export default SearchInput;
