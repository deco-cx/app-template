import { insertDocuments } from "../../../utils/product/submitProduct.ts";
import { ProductDocument } from "../../../utils/types.ts";
import { logger } from "@deco/deco/o11y";
import { productDocuments } from "../../../db/schema.ts";
import { eq } from "drizzle-orm";
import { AppContext } from "../../../mod.ts";
import withPassword from "../../../utils/auth/withPassword.ts";
export interface Props {
  password: string;
  /**
   * @title Sku
   * @description This action will add new documents to the product. No documents will be removed or overwritten.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
  /**
   * @title Documents
   */
  documents: ProductDocument[];
}

export default async function addDocuments(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<ProductDocument[] | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    await insertDocuments(props.documents, props.sku, records);
    const productDocs = await records
      .select()
      .from(productDocuments)
      .where(eq(productDocuments.subjectOf, props.sku));
    return productDocs as ProductDocument[];
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
