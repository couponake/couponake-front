const createNextIntlPlugin = require("next-intl/plugin");
const redirectsList = require("./redirects");
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.el-afdl.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "el-afdl.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.el-afdl.com",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // formats: ["image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "@heroui/button",
      "@heroui/input",
      "@heroui/modal",
    ],
    scrollRestoration: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  trailingSlash: true,

  async rewrites() {
    return [
      { source: "/robots.txt", destination: "/robots" },
      { source: "/sitemap.xml", destination: "/sitemap" },
      { source: "/sitemap-main.xml", destination: "/sitemap-main" },
      { source: "/sitemap-blogs.xml", destination: "/sitemap-blogs" },
      { source: "/sitemap-countries.xml", destination: "/sitemap-countries" },
      { source: "/sitemap-stores.xml", destination: "/sitemap-stores" },
      { source: "/sitemap-categories.xml", destination: "/sitemap-categories" },
      { source: "/sitemap-stores-images.xml", destination: "/sitemap-stores-images" },
    ];
  },
  async redirects() {
    return [
      ...redirectsList.flatMap((redirect : any) => [
        {
          source: redirect,
          destination: "/",
          permanent: true,
        },
      ]),

      // Comprehensive pattern matching
      {
        source: "/:path*/(الواتس|%D8%A7%D9%84%D9%88%D8%A7%D8%AA%D8%B3)/",
        destination: "/",
        permanent: true,
      },
      {
        source:
          "/:path*/(الانستاغرام|%D8%A7%D9%84%D8%A7%D9%86%D8%B3%D8%AA%D8%A7%D8%BA%D8%B1%D8%A7%D9%85)/",
        destination: "/",
        permanent: true,
      },
      {
        source:
          "/:path*/(التليجرام|%D8%A7%D9%84%D8%AA%D9%84%D9%8A%D8%AC%D8%B1%D8%A7%D9%85)/",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
