import { jsonLdString } from "@/lib/structured-data";

/** Server-rendered JSON-LD block (lands in the initial HTML, no client JS needed). */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}
