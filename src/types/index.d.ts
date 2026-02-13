export type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

export type favoritesItem = {
  id: number;
  store: StoreProps;
  created_at: string;
};

export interface Blog {
  id: number;
  title: string;
  content: string;
  category_id: string;
  image: string | null;
  image_alt: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  rate: string;
  voters: number;
  responsible: responsibile;
  review: {
    id: number;
    created_by: User | null;
    name: string | null;
    description: string | null;
    rate: string | null;
    store_id: number | null;
    created_at: string;
    updated_at: string;
    blog_id: number;
  }[];
  blog_seo: {
    title: string;
    description: string;
    image: string;
    "twitter:title": string;
    "twitter:description": string;
    "twitter:image": string;
    "og:title": string;
    "og:description": string;
    "og:image": string;
  };
}

export type Responsibile = {
  id: number;
  name: string;
  image: string;
  rate: string;
  short_content: string;
  long_content: string;
  articles_number: number;
  experience_years: number;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  name: string;
  token: string;
  email: string;
  notify_sub: number;
  phone: string;
  phone_country_code: string;
  image: string;
  created_at: string;
  favorites: favoritesItem[] | null;
};

export type SearchResult = {
  id: number;
  title: string;
  store_name: string;
  description: string | null;
  slug: string;
  image: string;
  is_featured: number;
  order: number | null;
  rate: string;
  type: "store" | "blog" | "category";
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: number;
  title: string;
  url: string;
  price: string;
  image: string;
  code: string;
  status: string;
  slug: string;
};

export type paginationProps = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export type BrandProps = {
  id: number;
  title: string;
  image: string;
  slug: string;
  created_at: string;
  updated_at: string;
  coupons?: CouponProps[];
  stores?: StoreProps[];
};

export type InfosItem = {
  id: number;
  title: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
};

export type userReview = {
  id: number;
  user: { data: User } | null;
  description: string;
  image: string;
  store: { data: StoreProps } | null;
  rate: string;
  created_at: string;
};

export type userReviewType = {
  id: number;
  created_by: any;
  name: string;
  description: string;
  rate: string;
  store_id: number;
  created_at: string;
  updated_at: string;
  blog_id: any;
};

export type testimonialType = {
  id: string;
  name: string;
  image: string;
  stars: string;
  description: string;
};

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  store_id: string | null;
  status: number;
  created_at: string;
};

export type SettingsItem = {
  id: number;
  name:
  | "_token"
  | "site_name"
  | "footer_description"
  | "facebook"
  | "side_whatsapp"
  | "side_telegram"
  | "instagram"
  | "image"
  | "footer_logo"
  | "popup_url"
  | "popup_location"
  | "popup_image";
  val: string;
};

export type CategoryItem = {
  id: number;
  name: string;
  image: string;
  slug: string;
  parent_id: number;
  coupons?: CouponProps[] | [];
  stores?: StoreProps[] | [];
  coupons_count?: number;
  created_at: string;
  updated_at: string;
  category_seo: any;
};

export type FeaturedStoresCategoryItem = {
  id: number;
  name: string;
  image: string;
  slug: string;
  parent_id: any;
  stores: featuredStores[];
  created_at: string;
  updated_at: string;
};

export type AdItem = {
  id: number;
  title: string;
  image: string;
  slug: string;
  code?: string;
  url: string;
  type: "ads" | "code" | "no-code";
  status: number;
  video: string | null;
  created_at: string;
  updated_at: string;
};

export type AdPage = {
  id: number;
  title: string;
  code: string;
  image: string;
  slug: string;
  url: string;
  type: "code" | "no-code";
  status: number;
  stores: StoreProps[] | null;
  description: string | null;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
};

export type BannerItem = {
  id: number;
  title?: string;
  code?: string;
  image?: string;
  image_small: string;
  image_medium: string;
  slug: string;
  url: string;
  type: "general" | "banner";
  status: number;
  video?: string;
  location: "above_texts" | "coupon_block" | "side_part";
  created_at: string;
  updated_at: string;
};

export type StoreProps = {
  id?: number;
  keywords: string;
  title: string;
  store_name: string;
  description: string | null;
  about_store: string | null;
  image: string;
  coupon_image: string;
  slug: string;
  is_featured: 0 | 1;
  order: number | null;
  rate: string;
  voters: number;
  brand: BrandProps[] | [];
  created_at: string;
  updated_at: string;
  isInFavorites: boolean;
  in_favourite: boolean;
  coupons: CouponProps[];
  social_links: string | [];
  category?: { id: number; name: string; slug: string }[];
  responsible: Responsibile;
  store_table:
  | { id: number; code: string; title: string; description: string }[]
  | [];
  currency: string;
  saved_price: string;
  orders_number: number;
  store_love: string;
  total_used_coupons: number;
  coupon_peak_times: string;
  popular_discounts: string;
  coupon_share_rate: string;
};

export type featuredStores = {
  id: number;
  title: string;
  store_name: string;
  image: string;
  slug: string;
  is_featured: number;
  isInFavorites: boolean;
  coupons_count: number;
  category: {
    id: number;
    name: string;
    slug: string;
  }[];
};

export type statisticsType = {
  store_love: string;
  currency: string;
  saved_price: number;
  orders_number: number;
  popular_category: { count: number; category: CategoryItem };
  max_coupon_discount: string;
  max_coupon_used: string;
  total_used_coupons: number;
  returned_visitors: string;
  coupon_peak_times: string;
  popular_discounts: string;
  coupon_share_rate: string;
};

export type CouponReaction = {
  id: number;
  coupon_id: number;
  user_id: number;
  emoji: reactionTypes;
  created_at: string;
  updated_at: string;
};

export type reactionTypes = "like" | "wow" | "angry" | "sad" | "love" | "haha";

export type CouponProps = {
  id: number;
  title: string;
  description: string | null;
  image: string;
  store_image: string;
  slug: string;
  code: string;
  url: string;
  emojis: CouponReaction[] | [];
  related_coupon: number;
  similar_coupon: number;
  discount_value: number;
  category: string;
  store: StoreProps | null;
  brand: string;
  store_id: number;
  store_slug: string;
  views: number | null;
  used: number | null;
  expire_date: string | null;
  order: number | null;
  country: string | null;
  type: "offer" | "coupon" | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  last_used: string;
};

export type LatestCoupons = {
  id: number;
  title: string;
  description: string;
  image: string;
  store_image: string;
  store_slug: string;
  slug: string;
  code: string;
  url: string;
  discount_value: string;
  store_id: number;
  views: any;
  used: any;
  expire_date: any;
  order: any;
  country: any;
  created_at: string;
  updated_at: string;
  emojis: any[];
  type: string;
  category: any[];
};

export type InfoItem = {
  id: number;
  title: string;
  description: string;
  status: number;
  created_at: string; // ISO 8601 formatted date string
  updated_at: string; // ISO 8601 formatted date string
};

export type MenuItem = {
  id: number;
  title: string;
  url: string;
  page: string;
  status: number;
  created_at: string; // ISO 8601 date string
  updated_at: string;
};
export type HeaderCategory = {
  id: number;
  name: string;
  image: string;
  slug: string;
};

export type profileTabsValues = "account" | "favorites" | "settings" | null;

export interface NotificationProps {
  id: number;
  notifiable_id: number;
  data: string;
  status: string;
  read_at: string | null; // Null when not read
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface SubItem {
  title: string;
  href: string;
}

export interface SidebarItem {
  title: string;
  type: "link" | "collapsible";
  href?: string;
  icon?: LucideIcon;
  items?: SubItem[];
}

export type SettingsResponse = {
  status: string;
  message: string;
  data: Settings;
};

export type Settings = {
  menus: MenuItem[] | null;
  settings: SettingsItem[] | null;
  notifications: NotificationProps[] | null;
};
