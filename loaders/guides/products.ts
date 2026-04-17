import { RequestURLParam } from "apps/website/functions/requestToParam.ts";
import { AppContext } from "../../mod.ts";
import { AppContext as RecordsAppContext } from "apps/records/mod.ts";
import { Product } from "apps/commerce/types.ts";
import { getCategoryTree } from "../../utils/product/getProduct.ts";
import {
  avaliableIn,
  images,
  productCategories,
  products,
} from "../../db/schema.ts";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { Category } from "../../utils/types.ts";
import { pickUrlComposed } from "../../utils/product/constants.ts";

export interface GuideProducts {
  products: Product[];
  category: Category;
}

interface Props {
  /**
   * @title Category Slug from URL
   */
  slug: RequestURLParam;
  /**
   * @title Sort By
   * @description Sort option of the products
   */
  sortBy?: "name-asc" | "name-desc";
  /**
   * @title Attribute to compose URL
   * @description Select an attribute to compose the product url
   */
  urlComposing?: UrlComposing;
  /**
   * @title Custom URL Pathname
   * @description Insert a custom URL path to be redirected to, onclick of a product card.
   */
  customPathname?: string;
}

export type UrlComposing = "slug" | "sku" | "modelCode" | "gtin";

export interface BaseProduct {
  name: string;
  alternateName?: string | null;
  productID: string;
  url: string;
  sku: string;
  gtin: string | null;
}

export interface BaseImage {
  url: string;
  name: string | null;
  description: string | null;
  identifier: number;
  subjectOf: string | null;
  disambiguatingDescription: string | null;
  additionalType: string | null;
}

export default async function loader(
  {
    slug,
    sortBy = "name-asc",
    urlComposing = "modelCode",
    customPathname = "guias-y-manuales",
  }: Props,
  req: Request,
  ctx: AppContext & RecordsAppContext,
): Promise<GuideProducts | null> {
  const url = new URL(req.url);
  const records = await ctx.invoke.records.loaders.drizzle();
  const { language } = ctx;
  const handledCustomPathname = customPathname.replace(/^\/+|\/+$/g, "");
  const categoryBranch = await getCategoryTree(records, slug);
  const selectedCategory = categoryBranch.find((c) => c.identifier === slug);
  const orderClause = language === "EN"
    ? products.alternateName
    : products.name;

  if (!selectedCategory) {
    return null;
  }

  const baseProducts = await records.select({
    name: products.name,
    alternateName: products.alternateName,
    productID: products.productID,
    url: products.url,
    sku: products.sku,
    gtin: products.gtin,
  }).from(productCategories)
    .innerJoin(
      products,
      eq(productCategories.product, products.sku),
    )
    .leftJoin(
      avaliableIn,
      eq(productCategories.product, avaliableIn.subjectOf),
    )
    .where(
      and(
        inArray(
          productCategories.subjectOf,
          categoryBranch.map((c) => c.identifier),
        ),
        sql`${url.hostname} LIKE '%' || ${avaliableIn.domain}`,
      ),
    )
    .groupBy(products.sku)
    .orderBy(
      sortBy === "name-asc" ? asc(orderClause) : desc(orderClause),
    ) as unknown as BaseProduct[];

  if (!baseProducts || baseProducts.length === 0) {
    return {
      category: selectedCategory,
      products: [],
    };
  }

  const productImages = await records
    .select()
    .from(images)
    .where(
      inArray(
        images.subjectOf,
        baseProducts.map((p) => p.sku),
      ),
    )
    .all() as unknown as BaseImage[];

  return {
    category: selectedCategory,
    products: baseProducts.map<Product>((p) => {
      return {
        "@type": "Product",
        name: language === "EN" ? p.alternateName ?? p.name : p.name,
        sku: p.sku,
        productID: p.productID ?? "",
        gtin: p.gtin ?? undefined,
        url: new URL(
          `${handledCustomPathname}/${pickUrlComposed(p, urlComposing)}/p`,
          url.origin,
        ).href,
        image: productImages
          .filter((i) => i.subjectOf === p.sku)
          .map((i) => ({
            "@type": "ImageObject" as const,
            ...i,
            disambiguatingDescription: i.disambiguatingDescription ??
              undefined,
            subjectOf: i.subjectOf ?? undefined,
            identifier: String(i.identifier),
          })),
      };
    }),
  };
}

export const cache = "stale-while-revalidate";

export const cacheKey = (
  {
    slug,
    sortBy = "name-asc",
    urlComposing = "modelCode",
    customPathname = "guias-y-manuales",
  }: Props,
) => {
  return `guides-${slug}-sortBy-${sortBy}-composeUrl-${urlComposing}-customPathname-${customPathname}`;
};
