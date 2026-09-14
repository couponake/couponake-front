import { getCountryOptions } from "@/services/public-reference-data";

export async function GET() {
  try {
    return Response.json({ data: await getCountryOptions() }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "Countries temporarily unavailable" }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}
