import { json, route } from "@/server/http";
import { routeParam } from "@/server/api";
import { requireParticipant } from "@/server/participant-auth";
import { participantResults } from "@/server/services/leaderboards";
import { idSchema } from "@/lib/validation";

/** GET /api/sessions/{id}/results — the signed-in participant's own breakdown, after the session finishes. */
export const GET = route<RouteContext<"/api/sessions/[id]/results">>(async (req, ctx) => {
  const p = await requireParticipant(req);
  return json(await participantResults(idSchema.parse(await routeParam(ctx, "id")), p.id));
});
