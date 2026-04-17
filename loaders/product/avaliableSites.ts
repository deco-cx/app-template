import { allowCorsFor, type FnContext } from "@deco/deco";
import { AppContext as RecordsContext } from "apps/records/mod.ts";
import { domains } from "../../db/schema.ts";
import { inArray, not } from "drizzle-orm";
import { DEFAULT_DOMAINS } from "../../utils/product/constants.ts";

/**
 * @title Avaliable Sites
 * @description Retrieves a avaliable sites from Deco Records.
 *
 * @param req - The request object.
 * @param ctx - The application context.
 * @returns A promise that resolves to a avaliable sites.
 */
export default async function avaliableSites(
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

  const allSites = await records.select({
    identifier: domains.identifier,
    name: domains.description,
  }).from(domains).where(not(inArray(domains.identifier, DEFAULT_DOMAINS)));

  return allSites.map(({ identifier, name }) => ({
    label: `${name} (${identifier})`,
    value: identifier,
  }));
}
