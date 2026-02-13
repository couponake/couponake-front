"use client";
import { useEffect, useRef } from "react";

interface scrollProps {
    event_name: string;
    event_category?: string;
}

export default function ScrollTracker({ event_name, event_category }: scrollProps = { event_name: "scroll_depth", event_category: "Scroll" }) {
    const sentPercents = useRef<number[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            const totalScroll = scrollTop + windowHeight;
            const scrollPercent = Math.round((totalScroll / docHeight) * 100);

            const thresholds = [25, 50, 75, 100];

            thresholds.forEach((threshold) => {
                if (
                    scrollPercent >= threshold &&
                    !sentPercents.current.includes(threshold)
                ) {
                    sentPercents.current.push(threshold);
                    // Fire GA4 event
                    if (typeof (window as any).gtag === "function") {
                        (window as any).gtag("event", event_name, {
                            event_category: event_category,
                            event_label: `${threshold}%`,
                            value: threshold,
                        });
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return null;
}
