"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { FaqItem } from "@/types";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { secureHtmlLinks } from "@/lib/htmlUtils";

const FAQ = ({
  faqs,
  className,
  title,
  storeName,
}: {
  faqs: FaqItem[];
  title: string;
  className?: string;
  storeName?: string;
}) => {

  if (faqs && faqs.length <= 0) {
    return null;
  }

  const faqsToDisplay = faqs;

  return (
    <section className={cn("container py-8 md:py-11 lg:py-20", className)}>
      <div className="flex gap-5 flex-wrap items-start justify-between my-5">
        <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 sm:text-xl">
          {title + (storeName ? ` ${storeName}` : "")}
        </h2>
      </div>

      <div className="space-y-5">
        <Accordion variant="splitted">
          {faqsToDisplay?.map((faq) => (
            <AccordionItem
              className="rounded-xl"
              key={faq?.id}
              aria-label={faq?.question}
              title={faq?.question}
              HeadingComponent={"h3"}
              onPress={() => {
                if (!storeName) return;

                // Track when FAQ is opened
                const item = document.getElementById(`faq-body-${faq.id}`);
                const isCurrentlyOpen = item?.getAttribute("data-open") === "true";

                if (!isCurrentlyOpen && typeof window !== "undefined" && (window as any).gtag) {
                  (window as any).gtag("event", `${storeName}_faq_click`, {
                    faq_id: faq?.id,
                    faq_question: faq?.question,
                  });
                }

                // Mark item as opened (simple workaround)
                if (item) {
                  item.setAttribute("data-open", isCurrentlyOpen ? "false" : "true");
                }
              }}
            >
              <p
                id={`faq-body-${faq.id}`}
                data-open="false"
                className="bg-default-200 p-3 rounded-md prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: secureHtmlLinks(faq?.answer),
                }}
              />
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* <div className="w-full flex gap-5 items-center justify-end mt-5">
        <div className="flex items-center gap-3">
          <Button className="gradient-btn" onPress={() => setShowAll(!showAll)}>
            {showAll ? t("View less") : t("View more")}
          </Button>
        </div>
      </div> */}
    </section>
  );
};

export default FAQ;
