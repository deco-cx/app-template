import {
  AvaliableIn,
  Measurements,
  ProductDocument,
} from "../../utils/types.ts";
import {
  AdditionalProperty,
  Description,
  ImageProduct,
  Product as BaseProduct,
  ProductCategory,
  Video,
} from "../../utils/types.ts";
import { logger } from "@deco/deco/o11y";
import { insertProduct } from "../../utils/product/submitProduct.ts";
import { AppContext } from "../../mod.ts";
import withPassword from "../../utils/auth/withPassword.ts";

export interface Props {
  password: string;
  /**
   * @title Base info
   */
  product: BaseProduct;
  /**
   * @title Measurements
   */
  measurements: Measurements;
  /**
   * @title Categories
   */
  categories: ProductCategory[];
  /**
   * @title Additional Properties
   */
  additionalProperties: AdditionalProperty[];
  /**
   * @title Descriptions
   */
  descriptions: Description[];
  /**
   * @title Images
   */
  images: ImageProduct[];
  /**
   * @title Videos
   */
  videos?: Video[];
  /**
   * @title Avaliability
   */
  avaliableIn: AvaliableIn[];
  /**
   * @title Documents
   */
  documents?: ProductDocument[];
}

export default async function createProduct(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<{ success: boolean; message?: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    await insertProduct({ ...props, records });
    return {
      success: true,
    };
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
