import { json, route } from "@/server/http";
import { routeParam } from "@/server/api";
import { LIMITS, limitAll, rule } from "@/server/rate-limit";
import { requireParticipant } from "@/server/participant-auth";
import { joinSession } from "@/server/services/sessions";
import { sessionCodeSchema } from "@/lib/validation";

/**
 * POST /api/sessions/{code}/join — admission into a session by its join code.
 * (The path segment is the 6-character session code.)
 * 200 when admitted (idempotent), 409 SESSION_FULL / SESSION_CLOSED / ALREADY_IN_ACTIVE_SESSION.
 */
export const POST = route<RouteContext<"/api/sessions/[id]/join">>(async (req, ctx) => {
  const p = await requireParticipant(req);
  await limitAll([rule(`join:p:${p.id}`, LIMITS.joinPerParticipant)]);
  const code = sessionCodeSchema.parse(await routeParam(ctx, "id"));
  const result = await joinSession(p.id, code);
  return json({ admitted: true, ...result });
});
