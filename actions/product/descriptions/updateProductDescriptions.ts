import { AppContext } from "../../../mod.ts";
import { Description } from "../../../utils/types.ts";
import { Description as DescriptionFromDatabase } from "../../../utils/product/getProduct.ts";
import withPassword from "../../../utils/auth/withPassword.ts";
import { overrideProductDescriptions } from "../../../utils/product/submitProduct.ts";
import { descriptions } from "../../../db/schema.ts";
import { eq } from "drizzle-orm";
import { logger } from "@deco/deco/o11y";
export interface Props {
  password: string;
  /**
   * @title Sku
   * @description This action will update the descriptions of the product. Existing descriptions will be overwritten.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
  /**
   * @title Product Descriptions
   */
  descriptions: Description[];
}

export default async function updateProductDescriptions(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<DescriptionFromDatabase[] | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    await overrideProductDescriptions(props.descriptions, props.sku, records);
    const productDescriptions = await records
      .select()
      .from(descriptions)
      .where(eq(descriptions.subjectOf, props.sku));
    return productDescriptions as DescriptionFromDatabase[];
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
