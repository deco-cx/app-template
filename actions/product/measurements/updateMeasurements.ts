import { logger } from "@deco/deco/o11y";
import { productMeasurements } from "../../../db/schema.ts";
import { AppContext } from "../../../mod.ts";
import withPassword from "../../../utils/auth/withPassword.ts";
import { overrideMeasurements } from "../../../utils/product/submitProduct.ts";
import { Measurements, ProductMeasurements } from "../../../utils/types.ts";
import { eq } from "drizzle-orm";

export interface Props {
  /**
   * @title Sku
   * @description This action will update the measurements of a product.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
  /**
   * @title Measurements
   * @description The measurements of the product.
   */
  measurements: Partial<Measurements>;
}

export default async function updateMeasurements(
  props: { password: string } & Props,
  _req: Request,
  ctx: AppContext,
): Promise<ProductMeasurements[] | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    await overrideMeasurements(props.measurements, props.sku, records);
    const measurements = await records
      .select()
      .from(productMeasurements)
      .where(eq(productMeasurements.subjectOf, props.sku));
    return measurements as ProductMeasurements[];
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
