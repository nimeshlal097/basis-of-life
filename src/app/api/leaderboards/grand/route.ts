import { json, route } from "@/server/http";
import { limitPublicRead } from "@/server/api";
import { getParticipant } from "@/server/participant-auth";
import { grandLeaderboard } from "@/server/services/leaderboards";

/** GET /api/leaderboards/grand — combined leaderboard of qualifiers from finalized sessions. */
export const GET = route(async (req) => {
  await limitPublicRead(req);
  const p = await getParticipant(req);
  return json(await grandLeaderboard(p?.id ?? null));
});
