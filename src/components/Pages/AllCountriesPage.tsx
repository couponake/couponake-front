"use client";
import { Input } from "@/components/ui/input";
import debounce from "@/lib/debounce";
import { paginationProps } from "@/types";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import axios from "axios";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaGlobeAmericas, FaSearch, FaTimes } from "react-icons/fa";

const AllCountriesPage = () => {
  const t = useTranslations();
  const [countries, setCountries] = useState<
    { name: string; meta: any }[] | null
  >(null);
  const [filteredCountries, setFilteredCountries] = useState<
    { name: string; meta: any }[] | null
  >(null);
  const [pagination, setPagination] = useState<paginationProps | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCountries = async (page = 1, search?: string) => {
    setIsLoading(true);
    try {
      const { data: response }: any = await axios.get(
        `/api/home/countries-meta`,
        {
          params: {
            search,
            page,
            perPage: 20,
          },
        }
      );
      setCountries(response.data);
      setFilteredCountries(response.data);
      setPagination(response?.meta);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch countries", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchCountries(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchCountries(currentPage, value);
    }, 300),
    [currentPage]
  );

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredCountries(countries);
  };

  // Animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-3 mb-2">
          <FaGlobeAmericas className="text-main-600 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-800">
            {t("All Countries")}
          </h1>
        </div>
        <p className="text-gray-600 mb-8 text-center max-w-2xl">
          {t(
            "Explore our comprehensive list of countries from around the world"
          )}
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-md mb-8 relative">
          <Input
            type="text"
            placeholder={t("Search countries")}
            value={searchQuery}
            onChange={handleSearchChange}
            className="pr-10"
            startContent={<FaSearch className="text-gray-400" />}
            endContent={
              searchQuery && (
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={handleClearSearch}
                >
                  <FaTimes className="text-gray-500" />
                </Button>
              )
            }
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 animate-pulse rounded-lg p-6 h-40"
            ></div>
          ))}
        </div>
      ) : filteredCountries?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">
            No countries found matching your search.
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredCountries?.map(
            (country: { name: string; meta: any }, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                variants={itemVariants}
              >
                <Link
                  target="_self"
                  href={`/coupon_country/${country?.name}`}
                  className="p-6 flex flex-col items-center gap-2"
                  // onClick={() => {
                  //   if (typeof window !== 'undefined' && (window as any).gtag) {
                  //     (window as any).gtag("event", "countries_click", {
                  //       country_name: country.name
                  //     });
                  //   }
                  // }}
                >
                  <div className="w-20 aspect-video border border-gray-200">
                    <Image
                      src={country?.meta?.image || "noPreview.webp"}
                      alt={country?.name || "Country Image"}
                      width={80}
                      height={80}
                      loading="lazy"
                      className="size-full object-cover"
                      unoptimized
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 text-center">
                    {country?.name}
                  </h2>
                </Link>
              </motion.div>
            )
          )}
        </motion.div>
      )}

      {pagination && filteredCountries?.length !== 0 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            total={pagination?.last_page}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            dir="ltr"
            className="shadow-sm"
          />
        </div>
      )}
    </section>
  );
};

export default AllCountriesPage;
