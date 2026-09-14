import { getSettings } from "@/services/GetSettingsRequest";
import { readIndexingSetting } from "@/lib/indexing-settings";
import { SettingsEnum } from "@/types/settingsEnum";

export const getSettingEnabled = async (
  settingName: string
): Promise<boolean> => {
  const settings = await getSettings();
  const siteEnabled = readIndexingSetting(settings, SettingsEnum.SuperSite);
  const pageEnabled = readIndexingSetting(settings, settingName);
  return siteEnabled && pageEnabled;
};
