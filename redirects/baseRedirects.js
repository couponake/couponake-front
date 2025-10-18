module.exports = [
  //sitemap url
  { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
  //cutome urls
  { source: '/all_categories/', destination: '/categories/', permanent: true },
  { source: '/about/', destination: '/about-us/', permanent: true },
  //countries
  { source: '/coupon_country/saudi-arabia/', destination: '/coupon_country/السعودية/', permanent: true },
  { source: '/coupon_country/united-arab-emirates/', destination: '/coupon_country/الإمارات/', permanent: true },
  { source: '/coupon_country/kuwait/', destination: '/coupon_country/الكويت/', permanent: true },
  { source: '/coupon_country/qatar/', destination: '/coupon_country/قطر/', permanent: true },
  { source: '/coupon_country/bahrain/', destination: '/coupon_country/البحرين/', permanent: true },
  { source: '/coupon_country/oman/', destination: '/coupon_country/عمان/', permanent: true },
  { source: '/coupon_country/jordan/', destination: '/coupon_country/الأردن/', permanent: true },
  { source: '/coupon_country/egypt/', destination: '/coupon_country/مصر/', permanent: true },
  { source: '/coupon_country/palestine/', destination: '/categories/', permanent: true },
  { source: '/coupon_country/tunisia/', destination: '/categories/', permanent: true },
  { source: '/coupon_country/sudan/', destination: '/categories/', permanent: true },
  { source: '/coupon_country/yemen/', destination: '/coupon_country/اليمن/', permanent: true },
  { source: '/coupon_country/lebanon/', destination: '/coupon_country/لبنان/', permanent: true },
  { source: '/coupon_country/syria/', destination: '/categories/', permanent: true },
  { source: '/coupon_country/morocco/', destination: '/categories/', permanent: true },
  { source: '/coupon_country/libya/', destination: '/categories/', permanent: true },
  { source: '/coupon_country/algeria/', destination: '/coupon_country/الجزائر/', permanent: true },
];