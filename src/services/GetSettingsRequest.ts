import { fetchApi } from "@/lib/api-result";
import { validateSettingsResponse } from "@/lib/indexing-settings";
import { unstable_cache } from "next/cache";
import { cache } from "react";

// Cache only validated settings, keeping the existing six-hour interval.
// A failed refresh leaves the last successful value available. With no valid
// cached value, propagate the failure instead of rendering accidental noindex.
const getValidatedSettings = unstable_cache(
  async () => {
    // Do not cache the raw HTTP 200: even a successful status may have a broken
    // payload. The outer cache is populated only after validation succeeds.
    const response = await fetchApi<unknown>("home", { revalidate: false });
    if (response.kind !== "ok") {
      throw new Error("Site settings endpoint did not return settings");
    }
    return validateSettingsResponse(response.data);
  },
  ["validated-site-settings-v1", process.env.NEXT_PUBLIC_API_URL ?? ""],
  { revalidate: 60 * 60 * 6, tags: ["home", "site-settings"] },
);

export const getSettings = cache(getValidatedSettings);
