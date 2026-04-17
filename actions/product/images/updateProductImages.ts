import { AppContext } from "../../../mod.ts";
import { ImageProduct } from "../../../utils/types.ts";
import { Image as ImageFromDatabase } from "../../../utils/product/getProduct.ts";
import { eq } from "drizzle-orm";
import withPassword from "../../../utils/auth/withPassword.ts";
import { overrideImages } from "../../../utils/product/submitProduct.ts";
import { logger } from "@deco/deco/o11y";
import { images } from "../../../db/schema.ts";

export interface Props {
  password: string;
  /**
   * @title Sku
   * @description This action will update the images of the product. Existing images will be overwritten.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
  /**
   * @title Images
   */
  images: ImageProduct[];
}

export default async function updateProductImages(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<ImageFromDatabase[] | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    await overrideImages(props.images, props.sku, records);
    const productImages = await records
      .select()
      .from(images)
      .where(eq(images.subjectOf, props.sku));
    return productImages as ImageFromDatabase[];
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
