import NextAuth from "next-auth";
import { authOptions } from "@/server/admin-auth";
import { adminBlocked } from "@/server/admin-access";

const handler = NextAuth(authOptions);

type Ctx = { params: Promise<{ nextauth: string[] }> };

/** Admin login endpoints; hidden from tunnelled requests when ADMIN_LOCAL_ONLY=true. */
async function guarded(req: Request, ctx: Ctx) {
  if (adminBlocked(req.headers)) {
    return Response.json({ error: { code: "NOT_FOUND", message: "Not found." } }, { status: 404 });
  }
  return handler(req, ctx);
}

export { guarded as GET, guarded as POST };
