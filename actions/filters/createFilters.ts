import { FiltersGroups } from "../../utils/types.ts";
import { logger } from "@deco/deco/o11y";
import { filtersGroups } from "../../db/schema.ts";
import withPassword from "../../utils/auth/withPassword.ts";
import { AppContext } from "../../mod.ts";

export interface Props {
  /**
   * @title Filters Groups
   * @description Add new filters groups.
   */
  filtersGroups: FiltersGroups[];
}

export default async function createFilters(
  { filtersGroups: filters, ...rest }: { password: string } & Props,
  _req: Request,
  ctx: AppContext,
) {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(rest, ctx);
    if (filters.length === 0) {
      throw new Error("No filters groups to insert");
    }
    await records.insert(filtersGroups).values(filters);

    return {
      success: true,
      data: filters,
    };
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e,
    };
  }
}
