import { clientIp, json, parseBody, route } from "@/server/http";
import { LIMITS, limitAll, rule } from "@/server/rate-limit";
import { participantCookieHeader } from "@/server/participant-auth";
import { registerParticipant } from "@/server/services/participants";
import { registerSchema } from "@/lib/validation";

/**
 * POST /api/participants — register a visitor with a nickname.
 * Sets the httpOnly visitor session cookie. The recovery code is returned
 * once, only to this visitor, and is stored server-side as a hash.
 */
export const POST = route(async (req) => {
  await limitAll([
    rule(`register:ip:${clientIp(req)}`, LIMITS.registerPerIp),
    rule("register:global", LIMITS.registerGlobal),
  ]);
  const input = await parseBody(req, registerSchema);
  const { participant, token, recoveryCode } = await registerParticipant(input);
  const res = json(
    {
      participant: { id: participant.id, nickname: participant.nickname, nicknameConsent: participant.nicknameConsent },
      recoveryCode,
    },
    { status: 201 },
  );
  res.headers.append("Set-Cookie", participantCookieHeader(token));
  return res;
});
