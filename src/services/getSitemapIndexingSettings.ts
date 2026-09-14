import { getSettings } from "@/services/GetSettingsRequest";
import { readIndexingSetting } from "@/lib/indexing-settings";
import { SettingsEnum } from "@/types/settingsEnum";

type responseType = {
  superSite: boolean;
  blogs: boolean;
  stores: boolean;
  countries: boolean;
  categories: boolean;
  about: boolean;
  privacy: boolean;
  contact: boolean;
  terms: boolean;
  faqs: boolean;
};

export const getSitemapSettingEnabled = async (): Promise<responseType> => {
  const settings = await getSettings();
  // Do not translate an upstream failure into false flags: sitemap routes
  // would otherwise return 404 or omit valid sections.
  return {
    superSite: readIndexingSetting(settings, SettingsEnum.SuperSite),
    blogs: readIndexingSetting(settings, SettingsEnum.Blogs),
    stores: readIndexingSetting(settings, SettingsEnum.Stores),
    countries: readIndexingSetting(settings, SettingsEnum.Countries),
    categories: readIndexingSetting(settings, SettingsEnum.Categories),
    about: readIndexingSetting(settings, SettingsEnum.About),
    privacy: readIndexingSetting(settings, SettingsEnum.Privacy),
    contact: readIndexingSetting(settings, SettingsEnum.Contact),
    terms: readIndexingSetting(settings, SettingsEnum.Terms),
    faqs: readIndexingSetting(settings, SettingsEnum.FAQ),
  };
};
