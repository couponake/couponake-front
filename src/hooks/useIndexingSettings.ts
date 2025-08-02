import { getSettings } from '@/services/GetSettingsRequest';
import { Settings } from '@/types';
import { SettingsEnum } from '@/types/settingsEnum';

type itemSetting = {
  id: number;
  name: string;
  val: string;
};

export const useSettingEnabled = async (
  settingName: string
): Promise<boolean> => {
  try {
    const generalSettings: Settings | undefined = await getSettings();
    const settingsArray: itemSetting[] = generalSettings?.settings || [];

    const getSettingVal = (key: string) =>
      settingsArray.find((item: itemSetting) => item.name === key)?.val;

    const isSuperSiteOn =
      getSettingVal(SettingsEnum.SuperSite) === "on" && true;
    const isTargetSettingOn = getSettingVal(settingName) === "on" && true;

    return isSuperSiteOn && isTargetSettingOn;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return false;
  }
};
