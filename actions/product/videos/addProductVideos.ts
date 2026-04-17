import { eq } from "drizzle-orm";
import { videos } from "../../../db/schema.ts";
import { AppContext } from "../../../mod.ts";
import withPassword from "../../../utils/auth/withPassword.ts";
import { insertVideos } from "../../../utils/product/submitProduct.ts";
import { Video } from "../../../utils/types.ts";
import { Video as VideoFromDatabase } from "../../../utils/product/getProduct.ts";
import { logger } from "@deco/deco/o11y";

export interface Props {
  password: string;
  /**
   * @title Sku
   * @description This action will add new videos to the product. No videos will be removed or overwritten.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
  /**
   * @title Videos
   */
  videos: Video[];
}

export default async function addProductVideos(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<VideoFromDatabase[] | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    await insertVideos(props.videos, props.sku, records);
    const productVideos = await records
      .select()
      .from(videos)
      .where(eq(videos.subjectOf, props.sku));
    return productVideos as VideoFromDatabase[];
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
