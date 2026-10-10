import { secureAnchorTags } from "./htmlUtils";

export const getContentDirection = (html: string): "rtl" | "ltr" => {
  // إزالة الـ HTML tags
  const text = html.replace(/<[^>]*>/g, "").trim();

  // لو فيه أي حرف عربي يبقى RTL
  return /[\u0600-\u06FF]/.test(text) ? "rtl" : "ltr";
};

export function secureStoreHtmlLinks(htmlContent: string): string {
  if (!htmlContent) return htmlContent;

  // 1. Wrap tables for horizontal scrolling
  const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/gi;
  htmlContent = htmlContent.replace(tableRegex, (match) => {
    return `<div>${match}</div>`;
  });

  // 2. إصلاح القوائم: تحديد اتجاه كل قائمة تلقائياً وحقن كلاسات صريحة (pl أو pr) لإنهاء المشكلة
  // قمنا بتحديث الـ Regex ليمسك الوسم بالكامل بمحتواه الداخلي
  const listRegex = /<(ul|ol)([^>]*)>([\s\S]*?)<\/\1>/gi;
  htmlContent = htmlContent.replace(
    listRegex,
    (match, tag, attributes, innerContent) => {
      // 1. إزالة أي inline padding قديم داخل الـ style تماماً لمنع التعارض
      let newAttributes = attributes.replace(
        /padding[-\w]*\s*:\s*[^;"]+[;]?/gi,
        "",
      );

      // 2. فحص محتوى القائمة الحالية لمعرفة لغتها واتجاهها الصحيح
      const isArabicList = /[\u0600-\u06FF]/.test(innerContent);
      const listDir = isArabicList ? "rtl" : "ltr";

      // 3. تحديد نوع القائمة واستخدام كلاسات فيزيائية صريحة (!pl أو !pr) لضمان النتيجة 100%
      const listStyleClass =
        tag.toLowerCase() === "ul" ? "list-disc" : "list-decimal";
      const directionClass = isArabicList ? "!pr-4 !pl-0" : "!pl-4 !pr-0";
      const tailwindClasses = `${listStyleClass} ${directionClass}`;

      // 4. حقن أو تحديث الـ dir الخاص بالقائمة نفسها بناءً على لغتها الحقيقية
      const dirMatch = /dir\s*=\s*["']([^"']*)["']/i.exec(newAttributes);
      if (dirMatch) {
        newAttributes = newAttributes.replace(dirMatch[0], `dir="${listDir}"`);
      } else {
        newAttributes += ` dir="${listDir}"`;
      }

      // 5. حقن كلاسات التنسيق والمسافات
      const classMatch = /class\s*=\s*["']([^"']*)["']/i.exec(newAttributes);
      if (classMatch) {
        newAttributes = newAttributes.replace(
          classMatch[0],
          `class="${classMatch[1]} ${tailwindClasses}"`,
        );
      } else {
        newAttributes += ` class="${tailwindClasses}"`;
      }

      // إرجاع الوسم كاملاً بالـ dir والكلاسات الجديدة والمحتوى الأصلي
      return `<${tag}${newAttributes}>${innerContent}</${tag}>`;
    },
  );

  // 3. Links: same rules as secureHtmlLinks — internal links (couponake.com or "/...") stay in the same tab,
  //    keep the referrer and are followed; external links get no-referrer, _blank and nofollow.
  return secureAnchorTags(htmlContent);
}
