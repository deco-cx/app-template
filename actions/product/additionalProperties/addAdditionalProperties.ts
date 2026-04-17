import { eq } from "drizzle-orm";
import { additionalProperties } from "../../../db/schema.ts";
import { AppContext } from "../../../mod.ts";
import withPassword from "../../../utils/auth/withPassword.ts";
import { insertAdditionalProperties } from "../../../utils/product/submitProduct.ts";
import { AdditionalProperty } from "../../../utils/types.ts";
import { logger } from "@deco/deco/o11y";

export interface Props {
  password: string;
  /**
   * @title Sku
   * @description This action will add new additional properties to the product. No additional properties will be removed or overwritten.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
  /**
   * @title Additional Properties
   */
  additionalProperties: AdditionalProperty[];
}

export default async function addAdditionalProperties(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<AdditionalProperty[] | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    await insertAdditionalProperties(
      props.additionalProperties,
      props.sku,
      records,
    );
    const retrievedAdditionalProperties = await records
      .select()
      .from(additionalProperties)
      .where(eq(additionalProperties.subjectOf, props.sku));
    return retrievedAdditionalProperties as AdditionalProperty[];
  } catch (e) {
    logger.error(e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
