<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sitemap"
>
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>Al Afdl Coupons - Main</title>
        <style>
          body { font-family: Arial; padding: 20px; background: #f4f4f4; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; border: 1px solid #e5e5e5; }
          th { background: #333; color: white; }
          a {
            text-decoration: none;
            color: #000;
            transition: color 0.2s ease;
          }
          a:hover {
            color: #004499;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Al Afdl Coupons - Main (<xsl:value-of select="count(//sitemap:url)"/>)</h1>
        <table>
          <tbody>
            <xsl:for-each select="//sitemap:url">
              <tr>
                <td>
                    <a href="{sitemap:loc}" target="_blank" rel="noopener noreferrer">
                        <xsl:value-of select="sitemap:loc"/>
                    </a>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>