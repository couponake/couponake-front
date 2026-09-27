module.exports = [
  // Old WordPress sitemap name (a previous owner of the domain submitted it to Google in 2020)
  { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
  { source: '/all_categories/', destination: '/categories/', permanent: true },
  { source: '/about/', destination: '/about-us/', permanent: true },
];
