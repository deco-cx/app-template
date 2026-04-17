import { addAvaliability } from "../../../utils/product/submitProduct.ts";
import { AvaliableIn } from "../../../utils/types.ts";
import { logger } from "@deco/deco/o11y";
import { AppContext } from "../../../mod.ts";
import withPassword from "../../../utils/auth/withPassword.ts";

export interface Props {
  password: string;
  /**
   * @title Sku
   * @description This action will add new domains to the product in order to make it available in the given domains. No avaliability options will be removed or overwritten.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
  /**
   * @title Avaliability
   */
  avaliableIn: AvaliableIn[];
}

export default async function addProductAvaliability(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<AvaliableIn[] | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    const productAvaliability = await addAvaliability(
      props.avaliableIn,
      props.sku,
      records,
    );
    return productAvaliability;
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
