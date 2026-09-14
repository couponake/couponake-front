import Link from "next/link";
import { storePageHref } from "@/lib/stores-list";

export default function StorePageLinks({ page, total }: { page: number; total: number }) {
  if (total <= 1) return null;
  const pages = Array.from(new Set([1, total, page-2, page-1, page, page+1, page+2]))
    .filter(n => n >= 1 && n <= total).sort((a,b) => a-b);
  return <nav aria-label="صفحات المتاجر" dir="ltr" className="flex flex-wrap items-center justify-center gap-2">
    {page > 1 && <Link prefetch={false} href={storePageHref(page-1)} className="rounded-lg border px-3 py-2" aria-label="الصفحة السابقة">السابق</Link>}
    {pages.map((n,i) => <span key={n} className="contents">
      {i > 0 && n > pages[i-1]+1 && <span aria-hidden="true">…</span>}
      <Link prefetch={false} href={storePageHref(n)} aria-label={`صفحة ${n}`}
        aria-current={n === page ? "page" : undefined}
        className={`rounded-lg border px-3 py-2 ${n === page ? "bg-main-600 text-white" : "bg-white"}`}>{n}</Link>
    </span>)}
    {page < total && <Link prefetch={false} href={storePageHref(page+1)} className="rounded-lg border px-3 py-2" aria-label="الصفحة التالية">التالي</Link>}
  </nav>;
}
