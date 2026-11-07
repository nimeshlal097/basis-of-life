import { json, route } from "@/server/http";
import { limitPublicRead, routeParam } from "@/server/api";
import { getParticipant } from "@/server/participant-auth";
import { sessionLeaderboard } from "@/server/services/leaderboards";
import { idSchema } from "@/lib/validation";

/** GET /api/sessions/{id}/leaderboard — public session ranking (official once finalized). */
export const GET = route<RouteContext<"/api/sessions/[id]/leaderboard">>(async (req, ctx) => {
  await limitPublicRead(req);
  const p = await getParticipant(req);
  return json(await sessionLeaderboard(idSchema.parse(await routeParam(ctx, "id")), p?.id ?? null));
});
