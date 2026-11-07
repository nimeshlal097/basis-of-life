import { clientIp, json, route } from "@/server/http";
import { routeParam } from "@/server/api";
import { LIMITS, limitAll, rule } from "@/server/rate-limit";
import { getParticipant } from "@/server/participant-auth";
import { getSessionState } from "@/server/services/sessions";
import { idSchema } from "@/lib/validation";

/**
 * GET /api/sessions/{id}/state — authoritative live state for polling.
 * Admitted participants also receive the currently open question (never
 * future questions, never correctness flags) and their accepted answer.
 */
export const GET = route<RouteContext<"/api/sessions/[id]/state">>(async (req, ctx) => {
  const p = await getParticipant(req);
  await limitAll([
    p ? rule(`state:p:${p.id}`, LIMITS.statePerParticipant) : rule(`read:ip:${clientIp(req)}`, LIMITS.publicReadPerIp),
  ]);
  const id = idSchema.parse(await routeParam(ctx, "id"));
  return json(await getSessionState(id, p?.id ?? null));
});
