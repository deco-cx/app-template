import { logger } from "@deco/deco/o11y";
import { AppContext } from "../../../mod.ts";
import withPassword from "../../../utils/auth/withPassword.ts";
import { overrideCategories } from "../../../utils/product/submitProduct.ts";
import { ProductCategory } from "../../../utils/types.ts";
import { productCategories } from "../../../db/schema.ts";
import { eq } from "drizzle-orm";
import { Category as CategoryFromDatabase } from "../../../utils/product/getProduct.ts";

export interface Props {
  password: string;
  /**
   * @title Sku
   * @description This action will update the categories of a product. Existing categories will be overwritten.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
  /**
   * @title Categories
   */
  categories: ProductCategory[];
}

export default async function updateProductCategories(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<CategoryFromDatabase[] | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    await overrideCategories(props.categories, props.sku, records);
    const categories = await records
      .select()
      .from(productCategories)
      .where(eq(productCategories.product, props.sku));
    return categories as CategoryFromDatabase[];
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
