import { allowCorsFor, type FnContext } from "@deco/deco";
import { AppContext as RecordsContext } from "apps/records/mod.ts";
import { filtersGroups } from "../../db/schema.ts";

/**
 * @title Avaliable Filters Groups
 * @description Retrieves a avaliable filters groups from Deco Records.
 *
 * @param req - The request object.
 * @param ctx - The application context.
 * @returns A promise that resolves to a avaliable filters groups.
 */
export default async function availableFiltersGroups(
  _props: unknown,
  req: Request,
  ctx: FnContext,
) {
  // Allow Cors
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });

  const recordsCtx = ctx as unknown as RecordsContext;
  const records = await recordsCtx.invoke.records.loaders.drizzle();

  const allFiltersGroups = await records.select({
    identifier: filtersGroups.identifier,
    name: filtersGroups.name,
    alternateName: filtersGroups.alternateName,
  }).from(filtersGroups);

  return allFiltersGroups.map(({ identifier, name, alternateName }) => ({
    label: alternateName
      ? `${identifier} - (${name} / ${alternateName})`
      : name,
    value: identifier,
  }));
}
