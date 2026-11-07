import { json, route } from "@/server/http";
import { routeParam } from "@/server/api";
import { requireParticipant } from "@/server/participant-auth";
import { leaveSession } from "@/server/services/sessions";
import { idSchema } from "@/lib/validation";

/** POST /api/sessions/{id}/leave — give up a seat before the session starts. */
export const POST = route<RouteContext<"/api/sessions/[id]/leave">>(async (req, ctx) => {
  const p = await requireParticipant(req);
  await leaveSession(p.id, idSchema.parse(await routeParam(ctx, "id")));
  return json({ left: true });
});
