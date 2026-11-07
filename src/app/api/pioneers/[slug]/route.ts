import { json, route } from "@/server/http";
import { limitPublicRead, requestLocale, routeParam } from "@/server/api";
import { ApiError } from "@/server/errors";
import { findPioneerBySlug } from "@/server/services/pioneers";
import { slugSchema } from "@/lib/validation";

/** GET /api/pioneers/{slug} — one published pioneer. Old slugs answer 308 with the new location. */
export const GET = route<RouteContext<"/api/pioneers/[slug]">>(async (req, ctx) => {
  await limitPublicRead(req);
  const parsed = slugSchema.safeParse(await routeParam(ctx, "slug"));
  if (!parsed.success) throw new ApiError(404, "NOT_FOUND", "Pioneer not found.");
  const { pioneer, redirectTo } = await findPioneerBySlug(parsed.data, requestLocale(req));
  if (redirectTo) {
    const res = json({ redirectTo: `/api/pioneers/${redirectTo}`, slug: redirectTo }, { status: 308 });
    res.headers.set("Location", `/api/pioneers/${redirectTo}`);
    return res;
  }
  if (!pioneer) throw new ApiError(404, "NOT_FOUND", "Pioneer not found.");
  return json({ pioneer });
});
