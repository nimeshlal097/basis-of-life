import { json, parseBody, route } from "@/server/http";
import { routeParam } from "@/server/api";
import { LIMITS, limitAll, rule } from "@/server/rate-limit";
import { requireParticipant } from "@/server/participant-auth";
import { submitAnswer } from "@/server/services/answers";
import { answerSchema, idSchema } from "@/lib/validation";

/**
 * POST /api/sessions/{id}/answers — submit one answer for the open question.
 * Idempotent for identical retries; 409 ANSWER_ALREADY_SUBMITTED for a
 * different option; 409 QUESTION_EXPIRED after the server deadline.
 */
export const POST = route<RouteContext<"/api/sessions/[id]/answers">>(async (req, ctx) => {
  const p = await requireParticipant(req);
  await limitAll([rule(`answer:p:${p.id}`, LIMITS.answerPerParticipant)]);
  const sessionId = idSchema.parse(await routeParam(ctx, "id"));
  const body = await parseBody(req, answerSchema);
  const receipt = await submitAnswer({ participantId: p.id, sessionId, ...body });
  return json(receipt, { status: receipt.duplicate ? 200 : 201 });
});
