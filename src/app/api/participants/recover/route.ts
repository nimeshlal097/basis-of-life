import { clientIp, json, parseBody, route } from "@/server/http";
import { LIMITS, limitAll, rule } from "@/server/rate-limit";
import { participantCookieHeader } from "@/server/participant-auth";
import { recoverParticipant } from "@/server/services/participants";
import { recoverSchema } from "@/lib/validation";

/** POST /api/participants/recover — restore a visitor identity on a new device or browser. */
export const POST = route(async (req) => {
  await limitAll([
    rule(`recover:ip:${clientIp(req)}`, LIMITS.recoverPerIp),
    rule("recover:global", LIMITS.recoverGlobal),
  ]);
  const { recoveryCode } = await parseBody(req, recoverSchema);
  const { participant, token } = await recoverParticipant(recoveryCode);
  const res = json({ participant: { id: participant.id, nickname: participant.nickname, nicknameConsent: participant.nicknameConsent } });
  res.headers.append("Set-Cookie", participantCookieHeader(token));
  return res;
});
