"use server";

import api from "../api";

export const getData = async (url: string) => {
  try {
    const data = await api.request.get(url);
    if (url === "home/featured-stores") {
      return data || []
    }
    return data?.data || [];
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    // Return empty array as fallback to prevent page crashes
    return [];
  }
};
