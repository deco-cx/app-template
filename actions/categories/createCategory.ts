import { Category } from "../../utils/types.ts";

import { logger } from "@deco/deco/o11y";
import { categories } from "../../db/schema.ts";
import { AppContext } from "../../mod.ts";
import withPassword from "../../utils/auth/withPassword.ts";

export default async function createCategory(
  { subjectOf, ...props }: { password: string } & Category,
  _req: Request,
  ctx: AppContext,
) {
  const records = await ctx.invoke.records.loaders.drizzle();
  const category = subjectOf?.split("---");
  try {
    withPassword(props, ctx);
    const additionalType = category ? String(Number(category[2]) + 1) : "1";
    const subjectOf = category ? category[0] : undefined;
    //Insert category
    await records.insert(categories).values({
      ...props,
      additionalType,
      subjectOf,
    });
    return {
      additionalType,
      subjectOf,
      ...props,
    };
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
