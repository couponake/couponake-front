/**
 * Utility functions for handling HTML content with security enhancements
 */
/**
 * Adds security attributes to all anchor tags in HTML content
 * - referrerPolicy="no-referrer" to prevent referrer information leakage
 * - rel="follow" if URL contains "el-afdl", otherwise "nofollow"
 * - target="_blank" to open links in a new tab
 *
 * @param htmlContent The original HTML content
 * @returns HTML content with security attributes added to anchor tags
 */
export function secureHtmlLinks(htmlContent: string): string {
  if (!htmlContent) return htmlContent;
  
  // Regular expression to find all anchor tags
  const anchorTagRegex = /<a([^>]*)>/gi;
  
  return htmlContent.replace(anchorTagRegex, (match, attributes) => {
    const hasReferrerPolicy = /referrerPolicy\s*=\s*["']no-referrer["']/i.test(
      attributes
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
      
      // Check if URL contains "el-afdl"
      shouldFollow = originalHref.includes("el-afdl");
      
      // Clean and modify URL
      try {
        const url = new URL(originalHref);
        // Only modify the pathname part (e.g. "/أرخص-الوجهات")
        let cleanedPathname = url.pathname.replace(/-/g, " ");
        if (!cleanedPathname.endsWith("/")) {
          cleanedPathname += "/";
        }
        url.pathname = cleanedPathname;
        const encodedHref = url.toString();
        newAttributes = newAttributes.replace(
          hrefMatch[0],
          `href="${encodedHref}"`
        );
      } catch (e) {
        // If it's a malformed URL (e.g., relative), still check for "el-afdl"
        // Keep the original href
      }
    }
    
    // Set rel attribute based on whether URL contains "el-afdl"
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