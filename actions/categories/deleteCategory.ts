import { categories, productCategories } from "../../db/schema.ts";
import { eq } from "drizzle-orm";
import { logger } from "@deco/deco/o11y";
import withPassword from "../../utils/auth/withPassword.ts";
import { AppContext } from "../../mod.ts";
import { matchAvaliableCategoriesLoaderPattern } from "../../utils/utils.ts";

export interface Props {
  password: string;
  /**
   * @title Category
   * @description Select a category to delete.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableCategories.ts
   */
  categoryIdentifier: string;
}

export default async function updateCategory(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { categoryIdentifier } = props;
  const records = await ctx.invoke.records.loaders.drizzle();

  try {
    withPassword(props, ctx);
    const identifier = categoryIdentifier
      ? matchAvaliableCategoriesLoaderPattern(categoryIdentifier)
        ?.categoryId
      : undefined;

    //Check if category has subcategories
    const subcategories = await records.select().from(categories).where(
      eq(categories.subjectOf, identifier),
    );
    if (subcategories.length > 0) {
      throw new Error(
        "Category has subcategories. Delete or change subcategories before deleting this category.",
      );
    }

    //Check if category has products
    const products = await records.select().from(productCategories).where(
      eq(productCategories.subjectOf, identifier),
    );
    if (products.length > 0) {
      throw new Error(
        "Category has products. Change product categories before deleting this category.",
      );
    }

    //Delete category
    await records.delete(categories).where(
      eq(categories.identifier, identifier),
    );

    return {
      success: true,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
