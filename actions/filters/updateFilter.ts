import { filtersGroups } from "../../db/schema.ts";
import { eq } from "drizzle-orm";
import { logger } from "@deco/deco/o11y";
import { AppContext } from "../../mod.ts";
import withPassword from "../../utils/auth/withPassword.ts";

export interface Props {
  password: string;
  /**
   * @title Filter Group
   * @description Select a filter group to update.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableFiltersGroups.ts
   */
  filterIdentifier: string;
  /**
   * @title Spanish Name
   */
  name: string;
  /**
   * @title English Name
   */
  alternateName: string;
}

export default async function updateFilter(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { filterIdentifier, ...rest } = props;
  const records = await ctx.invoke.records.loaders.drizzle();

  try {
    withPassword(props, ctx);
    await records.update(filtersGroups).set({
      ...rest,
    }).where(eq(filtersGroups.identifier, filterIdentifier));
    return {
      success: true,
      filterIdentifier,
      ...rest,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
    };
  }
}
