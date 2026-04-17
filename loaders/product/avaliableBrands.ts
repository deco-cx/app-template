import { allowCorsFor, type FnContext } from "@deco/deco";
import { AppContext as RecordsContext } from "apps/records/mod.ts";
import { brands } from "../../db/schema.ts";

/**
 * @title Avaliable Brands
 * @description Retrieves a avaliable brands from Deco Records.
 *
 * @param req - The request object.
 * @param ctx - The application context.
 * @returns A promise that resolves to a avaliable brands.
 */
export default async function avaliableBrands(
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

  const allBrands = await records.select({
    identifier: brands.identifier,
    name: brands.name,
  }).from(brands);

  return allBrands.map(({ identifier, name }) => ({
    label: name,
    value: `${identifier}---${name}`,
  }));
}
