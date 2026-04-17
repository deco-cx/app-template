import { overrideBaseData } from "../../utils/product/submitProduct.ts";
import { Product as DatabaseProduct } from "../../utils/types.ts";
import { logger } from "@deco/deco/o11y";
import { getProduct } from "../../utils/product/getProduct.ts";
import { Product } from "apps/commerce/types.ts";
import withPassword from "../../utils/auth/withPassword.ts";
import { AppContext } from "../../mod.ts";
import { matchAvaliableBrandsLoaderPattern } from "../../utils/utils.ts";

export interface Props extends Partial<DatabaseProduct> {
  /**
   * @title Sku
   * @description This action will update the basic data of an product. Blank fields will not be changed.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
}

export default async function updateProductBasicData(
  props: { password: string } & Props,
  req: Request,
  ctx: AppContext,
): Promise<Product | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  const { brandId } = matchAvaliableBrandsLoaderPattern(props.brand ?? "") ??
    {};
  const url = new URL(req.url);
  try {
    withPassword(props, ctx);
    await overrideBaseData({
      ...props,
      brand: brandId,
    }, records);

    const product = await getProduct(props.sku, ctx, url, true);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
