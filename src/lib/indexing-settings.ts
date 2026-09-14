import { SettingsEnum } from "@/types/settingsEnum";
import type { Settings } from "@/types";

/** Validate before caching: absent settings are not an indexing decision. */
export function validateSettingsResponse(payload: unknown): Settings {
  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    throw new Error("Invalid site settings response");
  }
  const data = payload.data as Settings | undefined;
  if (
    !data ||
    !Array.isArray(data.settings) ||
    !Array.isArray(data.menus) ||
    !Array.isArray(data.notifications)
  ) {
    throw new Error("Incomplete site settings response");
  }
  for (const name of Object.values(SettingsEnum)) {
    readIndexingSetting(data, name);
  }
  return data;
}

export function readIndexingSetting(settings: Settings, name: string): boolean {
  const matches = settings.settings.filter((item) => item?.name === name);
  if (
    matches.length !== 1 ||
    (matches[0].val !== "on" && matches[0].val !== "off")
  ) {
    throw new Error(`Missing or invalid indexing setting: ${name}`);
  }
  return matches[0].val === "on";
}
