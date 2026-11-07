import { json, route } from "@/server/http";
import { limitPublicRead, requestLocale } from "@/server/api";
import { listPublishedPioneers } from "@/server/services/pioneers";

/** GET /api/pioneers?lang=en|si — published pioneers for the homepage grid. */
export const GET = route(async (req) => {
  await limitPublicRead(req);
  const locale = requestLocale(req);
  return json({ locale, pioneers: await listPublishedPioneers(locale) });
});
