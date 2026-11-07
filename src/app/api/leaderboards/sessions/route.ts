import { json, route } from "@/server/http";
import { limitPublicRead } from "@/server/api";
import { finalizedSessionsList } from "@/server/services/leaderboards";

/** GET /api/leaderboards/sessions — finished sessions that have a leaderboard. */
export const GET = route(async (req) => {
  await limitPublicRead(req);
  return json({ sessions: await finalizedSessionsList() });
});
