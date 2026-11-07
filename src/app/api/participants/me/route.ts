import { json, readCookie, route } from "@/server/http";
import { prisma } from "@/server/db";
import { ApiError } from "@/server/errors";
import { PARTICIPANT_COOKIE, clearParticipantCookieHeader, getParticipant, hmac } from "@/server/participant-auth";
import { currentMembership } from "@/server/services/participants";

/** GET /api/participants/me — the signed-in visitor and their active session, if any. */
export const GET = route(async (req) => {
  const p = await getParticipant(req);
  if (!p) throw new ApiError(401, "UNAUTHENTICATED", "Not registered on this device.");
  return json({
    participant: { id: p.id, nickname: p.nickname, nicknameConsent: p.nicknameConsent },
    activeSession: await currentMembership(p.id),
  });
});

/** DELETE /api/participants/me — sign out on this device (revokes the session token). */
export const DELETE = route(async (req) => {
  const token = readCookie(req, PARTICIPANT_COOKIE);
  if (token) {
    await prisma.participantCredential.updateMany({
      where: { tokenHash: hmac(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  const res = json({ ok: true });
  res.headers.append("Set-Cookie", clearParticipantCookieHeader());
  return res;
});
