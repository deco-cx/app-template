import { logger } from "@deco/deco/o11y";
import { additionalProperties } from "../../../db/schema.ts";
import { AppContext } from "../../../mod.ts";
import withPassword from "../../../utils/auth/withPassword.ts";
import { overrideAdditionalProperties } from "../../../utils/product/submitProduct.ts";
import { AdditionalProperty } from "../../../utils/types.ts";
import { eq } from "drizzle-orm";

export interface Props {
  password: string;
  /**
   * @title Sku
   * @description This action will update the additional properties of an product. Existing additional properties will be overwritten.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSkus.ts
   */
  sku: string;
  /**
   * @title Additional Properties
   */
  additionalProperties: AdditionalProperty[];
}

export default async function updateAdditionalProperties(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<AdditionalProperty[] | { success: boolean; message: string }> {
  const records = await ctx.invoke.records.loaders.drizzle();
  try {
    withPassword(props, ctx);
    await overrideAdditionalProperties(
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
