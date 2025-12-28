import { getSettings } from "@/services/GetSettingsRequest";
import { Settings } from "@/types";
import { SettingsEnum } from "@/types/settingsEnum";

type itemSetting = {
  id: number;
  name: string;
  val: string;
};

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
  try {
    const generalSettings: Settings | undefined = await getSettings();
    const settingsArray: itemSetting[] = generalSettings?.settings || [];

    const getSettingVal = (key: string) =>
      settingsArray.find((item: itemSetting) => item.name === key)?.val;

    const superSite = getSettingVal(SettingsEnum.SuperSite) === "on" && true;
    const blogs = getSettingVal(SettingsEnum.Blogs) === "on" && true;
    const stores = getSettingVal(SettingsEnum.Stores) === "on" && true;
    const countries = getSettingVal(SettingsEnum.Countries) === "on" && true;
    const categories = getSettingVal(SettingsEnum.Categories) === "on" && true;
    const about = getSettingVal(SettingsEnum.About) === "on" && true;
    const privacy = getSettingVal(SettingsEnum.Privacy) === "on" && true;
    const contact = getSettingVal(SettingsEnum.Contact) === "on" && true;
    const terms = getSettingVal(SettingsEnum.Terms) === "on" && true;
    const faqs = getSettingVal(SettingsEnum.FAQ) === "on" && true;

    return {
      superSite,
      blogs,
      stores,
      countries,
      categories,
      about,
      privacy,
      contact,
      terms,
      faqs,
    };
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {
      superSite: false,
      blogs: false,
      stores: false,
      countries: false,
      categories: false,
      about: false,
      privacy: false,
      contact: false,
      terms: false,
      faqs: false,
    };
  }
};
