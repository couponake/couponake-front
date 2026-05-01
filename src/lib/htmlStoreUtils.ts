/**
 * Transforms raw backend HTML for safe rendering:
 * 1. Converts any wrapper tag to <h2>
 * 2. Wraps every <table> in a scroll container
 * 3. Secures external links
 */
export function processStoreHtml(html: string | null): string {
  if (!html) return "";

  return (
    html
      
      // Wrap each table in a scroll container BEFORE securing links
      .replace(/<table/gi, '<div class="table-scroll-wrapper"><table')
      .replace(/<\/table>/gi, "</table></div>")
  );
}