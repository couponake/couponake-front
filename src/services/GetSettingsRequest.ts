import api from "@/lib/api";
import { Settings, SettingsResponse } from "@/types";
import { cache } from "react";

export const getSettings = cache(async () => {
  try {
    const data: SettingsResponse = await api.static<SettingsResponse>(
      "home",
      60 * 60 * 6
    );
    return data?.data as Settings;
  } catch (error) {
    console.log(error);
  }
});
