/**
 * Utility functions for handling HTML content with security enhancements
 */
/**
 * Adds security attributes to all anchor tags in HTML content
 * - referrerPolicy="no-referrer" to prevent referrer information leakage
 * - rel="follow" if URL contains "coupoonat", otherwise "nofollow"
 * - target="_blank" to open links in a new tab
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

  // Regular expression to find all anchor tags
  const anchorTagRegex = /<a([^>]*)>/gi;

  return htmlContent.replace(anchorTagRegex, (match, attributes) => {
    const hasReferrerPolicy = /referrerPolicy\s*=\s*["']no-referrer["']/i.test(
      attributes,
    );
    const hasTargetBlank = /target\s*=\s*["']_blank["']/i.test(attributes);

    let newAttributes = attributes;

    // Add referrerPolicy if not present
    if (!hasReferrerPolicy) {
      newAttributes += ' referrerPolicy="no-referrer"';
    }

    // Add target="_blank" if not present
    if (!hasTargetBlank) {
      newAttributes += ' target="_blank"';
    }

    // Handle rel attribute based on URL content
    const hrefMatch = /href\s*=\s*["']([^"']+)["']/i.exec(newAttributes);
    let shouldFollow = false;

    if (hrefMatch) {
      const originalHref = hrefMatch[1];

      // Check if URL contains "coupoonat"
      shouldFollow = originalHref.includes("coupoonat");

      // Clean and modify URL
      try {
        const url = new URL(originalHref);

        if (!url.pathname.endsWith("/")) {
          url.pathname += "/";
        }
        url.pathname = url.pathname;
        const encodedHref = url.toString();
        newAttributes = newAttributes.replace(
          hrefMatch[0],
          `href="${encodedHref}"`,
        );
      } catch {
        // If it's a malformed URL (e.g., relative), still check for "coupoonat"
        // Keep the original href
      }
    }

    // Set rel attribute based on whether URL contains "coupoonat"
    const relValue = shouldFollow ? "follow" : "nofollow";
    const relMatch = /rel\s*=\s*["']([^"']*)["']/i.exec(attributes);

    if (relMatch) {
      // Replace existing rel attribute
      newAttributes = newAttributes.replace(relMatch[0], `rel="${relValue}"`);
    } else {
      // Add new rel attribute
      newAttributes += ` rel="${relValue}"`;
    }

    return `<a${newAttributes}>`;
  });
}