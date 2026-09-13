import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import arabicRedirects from './redirects/arabicRedirects';
import baseRedirects from './redirects/baseRedirects';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
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
    qualities: [25, 50, 75, 85, 100],
    // formats: ["image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {},
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "@heroui/button",
      "@heroui/input",
      "@heroui/modal",
    ],
    scrollRestoration: true,
    // Build-time prerender of the store pages (store/[slug]/generateStaticParams)
    // makes ~2 API calls per store from the single build IP. api.coupoonat.com
    // sits behind a Cloudflare rate limit of 200 requests / 10 s per IP and a
    // PHP-FPM pool of 5 workers, so static generation runs in one worker, 3 pages
    // at a time, and retries a page whose render fails before failing the build.
    // Build-time only; nothing at runtime changes.
    cpus: 1,
    staticGenerationMaxConcurrency: 3,
    staticGenerationRetryCount: 3,
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
      ...baseRedirects,
      ...arabicRedirects,

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
      // {
      //   source: "/:path*%20:pathAfter*",
      //   destination: "/",
      //   permanent: true,
      // },
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
        source: "/store/:slug([a-zA-Z0-9-]+)/:path+",
        destination: "/store/:slug/",
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
      {
        source: "/category/:path*",
        destination: "/",
        permanent: true,
      },
      {
        // Redirect paginated URLs like /something/page/2/
        source: "/:slug*/page/:page(\\d+)/",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
