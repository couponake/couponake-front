import api from "@/lib/api";
import { Settings, SettingsResponse } from "@/types";
import { cache } from "react";

export const getSettings = cache(async () => {
  try {
    const data: SettingsResponse = await api.static<SettingsResponse>(
      "home",
      10 //shuold be 60 minutes, but we use 10 for testing purposes
    ); //extend the cache time to 1 hour to increase the speed of the app
    return data?.data as Settings;
  } catch (error) {
    console.log(error);
  }
});
