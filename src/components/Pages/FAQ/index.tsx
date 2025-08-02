"use client";
import { secureHtmlLinks } from '@/lib/htmlUtils';
import { FaqItem } from '@/types';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { SearchIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

const FAQPage = ({ faqs }: { faqs: FaqItem[] }) => {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [filteredFaqs, setFilteredFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    const filtered = faqs.filter((faq) => {
      const matchesSearch = faq.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    setFilteredFaqs(filtered);
  }, [searchQuery, faqs]);

  const faqsToDisplay = showAll ? filteredFaqs : filteredFaqs.slice(0, 8);

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white -mt-5">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("Frequently Asked Questions")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("Find answers to common questions about our services")}
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <Input
              placeholder={t("search_here")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<SearchIcon className="text-gray-400 size-5" />}
              endContent={
                searchQuery && (
                  <Button
                    onPress={() => setSearchQuery("")}
                    variant="light"
                    size="sm"
                    isIconOnly
                    className="rounded-full"
                  >
                    <XIcon className="size-4" />
                  </Button>
                )
              }
              className="w-full"
            />
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion variant="splitted" className="space-y-4">
              {faqsToDisplay.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  aria-label={faq.question}
                  title={faq.question}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div
                    className="prose prose-lg max-w-none dark:prose-invert p-4 text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: secureHtmlLinks(faq.answer as string),
                    }}
                  />
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length > 5 && (
              <div className="text-center mt-8">
                <Button
                  className="gradient-btn"
                  onPress={() => setShowAll(!showAll)}
                >
                  {showAll ? t("View less") : t("View more")}
                </Button>
              </div>
            )}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {t("No FAQs found matching your search criteria")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default FAQPage;
