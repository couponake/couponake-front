const createNextIntlPlugin = require("next-intl/plugin");
const redirectsList = require("./redirects");
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.coupoonat.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "coupoonat.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.coupoonat.com",
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
      // Main sitemap index
      { source: "/sitemap.xml", destination: "/sitemap" },

      // Section sitemaps (main pages)
      { source: "/sitemap/main.xml", destination: "/sitemap/main" },
      { source: "/sitemap/blogs.xml", destination: "/sitemap/blogs" },
      { source: "/sitemap/countries.xml", destination: "/sitemap/countries" },
      { source: "/sitemap/stores.xml", destination: "/sitemap/stores" },
      { source: "/sitemap/categories.xml", destination: "/sitemap/categories" },
      {
        source: "/sitemap/stores-images.xml",
        destination: "/sitemap/stores-images",
      },

      // Paginated sitemaps
      {
        source: "/sitemap/blogs/:page.xml",
        destination: "/sitemap/blogs/:page",
      },
      {
        source: "/sitemap/stores/:page.xml",
        destination: "/sitemap/stores/:page",
      },
      {
        source: "/sitemap/stores-images/:page.xml",
        destination: "/sitemap/stores-images/:page",
      },

      // Alternative patterns for numeric pagination (if needed)
      {
        source: "/sitemap/blogs/page-:page(\\d+).xml",
        destination: "/sitemap/blogs/:page",
      },
      {
        source: "/sitemap/stores/page-:page(\\d+).xml",
        destination: "/sitemap/stores/:page",
      },
      {
        source: "/sitemap/stores-images/page-:page(\\d+).xml",
        destination: "/sitemap/stores-images/:page",
      },
    ];
  },
  async redirects() {
    return [
      ...redirectsList.flatMap((redirect: any) => [
        {
          source: redirect.from,
          destination: redirect.to,
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
      {
        source: "/:path*/feed/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:path*%20:pathAfter*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/coupon/:slug*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/page/:page(\\d+)",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-content/uploads/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/store/:path*\\.(png|jpg|jpeg|gif|webp|svg)",
        destination: "/",
        permanent: true,
      },
      {
        source: "/author/:slug*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/.well-known/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:protocol(http|https)/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
