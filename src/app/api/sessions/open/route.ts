import { json, route } from "@/server/http";
import { limitPublicRead } from "@/server/api";
import { listOpenSessions } from "@/server/services/sessions";

/** GET /api/sessions/open — sessions currently accepting participants. */
export const GET = route(async (req) => {
  await limitPublicRead(req);
  return json({ sessions: await listOpenSessions() });
});
