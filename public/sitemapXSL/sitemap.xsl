<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sitemap"
>
  <xsl:output method="html" indent="yes" />

  <xsl:template match="/">
    <html>
      <head>
        <title>Couponake - Sitemap</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 12px;
            border: 1px solid #e5e5e5;
            text-align: left;
          }
          th {
            background-color: #333;
            color: white;
          }
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
        <h1>Couponake - Sitemap (<xsl:value-of select="count(//sitemap:sitemap)"/>)</h1>
        <table>
          <!-- <thead>
            <tr>
              <th>Location</th>
            </tr>
          </thead> -->
          <tbody>
            <xsl:for-each select="//sitemap:sitemap">
              <tr>
                <td>
                  <a href="{sitemap:loc}" target="_blank" rel="noopener noreferrer">
                    <xsl:value-of select="sitemap:loc" />
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
