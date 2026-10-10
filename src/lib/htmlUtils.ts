/**
 * Utility functions for handling HTML content with security enhancements
 */

const SITE_ORIGIN = "https://couponake.com";

/**
 * Internal link = absolute URL on https://couponake.com or a root-relative path ("/store/x/").
 */
function isInternalHref(href: string): boolean {
  if (href.startsWith("//")) return false;
  if (href.startsWith("/")) return true;
  return href === SITE_ORIGIN || href.startsWith(`${SITE_ORIGIN}/`);
}

/**
 * Normalizes an internal href to an absolute https://couponake.com URL whose path ends with "/".
 */
function normalizeInternalHref(href: string): string {
  try {
    const url = new URL(href, `${SITE_ORIGIN}/`);
    if (!url.pathname.endsWith("/")) {
      url.pathname += "/";
    }
    return url.toString();
  } catch {
    return href;
  }
}

/**
 * Adds security attributes to anchor tags in HTML content.
 *
 * Internal links (https://couponake.com/... or "/..."):
 *   - normalized to an absolute https://couponake.com URL ending with "/"
 *   - opened in the same tab (no target="_blank"), referrer kept, no rel attribute (followed)
 *
 * External links:
 *   - referrerPolicy="no-referrer", target="_blank", rel="nofollow"
 *
 * Tables are wrapped in a <div> for horizontal scrolling.
 *
 * @param htmlContent The original HTML content
 * @returns HTML content with security attributes added to anchor tags
 */
export function secureHtmlLinks(htmlContent: string): string {
  if (!htmlContent) return htmlContent;

  // Wrap tables for horizontal scrolling
  const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/gi;
  htmlContent = htmlContent.replace(tableRegex, (match) => {
    return `<div>${match}</div>`;
  });

  return secureAnchorTags(htmlContent);
}

/**
 * Anchor-only part of secureHtmlLinks (no table wrapping), shared with the store page renderer
 * (secureStoreHtmlLinks) so every content block treats internal and external links the same way.
 */
export function secureAnchorTags(htmlContent: string): string {
  if (!htmlContent) return htmlContent;

  // Regular expression to find all anchor tags
  const anchorTagRegex = /<a(\s[^>]*)?>/gi;

  return htmlContent.replace(anchorTagRegex, (match, attrs) => {
    const attributes: string = attrs ?? "";
    const hrefMatch = /href\s*=\s*["']([^"']+)["']/i.exec(attributes);
    const href = hrefMatch ? hrefMatch[1].trim() : "";

    if (hrefMatch && isInternalHref(href)) {
      // Internal link: same tab, keep referrer, followed
      let internal = attributes
        .replace(/\s*target\s*=\s*["'][^"']*["']/gi, "")
        .replace(/\s*referrerPolicy\s*=\s*["'][^"']*["']/gi, "")
        .replace(/\s*rel\s*=\s*["'][^"']*["']/gi, "");
      internal = internal.replace(
        /href\s*=\s*["'][^"']+["']/i,
        `href="${normalizeInternalHref(href)}"`,
      );
      return `<a${internal}>`;
    }

    // External link (unchanged behaviour)
    let newAttributes = attributes;

    if (!/referrerPolicy\s*=\s*["']no-referrer["']/i.test(attributes)) {
      newAttributes += ' referrerPolicy="no-referrer"';
    }
    if (!/target\s*=\s*["']_blank["']/i.test(attributes)) {
      newAttributes += ' target="_blank"';
    }
    if (hrefMatch) {
      try {
        const url = new URL(href);
        if (!url.pathname.endsWith("/")) {
          url.pathname += "/";
        }
        newAttributes = newAttributes.replace(hrefMatch[0], `href="${url.toString()}"`);
      } catch {
        // Malformed or non-http URL (mailto:, tel:, #anchor): keep the original href
      }
    }

    const relMatch = /rel\s*=\s*["']([^"']*)["']/i.exec(attributes);
    if (relMatch) {
      newAttributes = newAttributes.replace(relMatch[0], 'rel="nofollow"');
    } else {
      newAttributes += ' rel="nofollow"';
    }

    return `<a${newAttributes}>`;
  });
}
