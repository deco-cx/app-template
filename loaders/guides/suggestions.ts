import { Product } from "apps/commerce/types.ts";
import { AppContext } from "../../mod.ts";
import { AppContext as RecordsContext } from "apps/records/mod.ts";
import { BaseImage, UrlComposing } from "./products.ts";
import { avaliableIn, images, products } from "../../db/schema.ts";
import { BaseProduct } from "./products.ts";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import {
  DATABASE_FIELDS,
  pickUrlComposed,
} from "../../utils/product/constants.ts";

interface Props {
  term?: string;
  /**
   * @title Search by determinated field
   */
  searchBy?: UrlComposing;
  /**
   * @title Custom URL Pathname
   * @description Insert a custom URL path to be redirected to, onclick of a product card.
   */
  customPathname?: string;
  /**
   * @title Skip registers
   */
  skip?: number;
  /**
   * @title Take registers
   */
  take?: number;
  /**
   * @title Sort By
   * @description Sort option of the products
   */
  sortBy?: "name-asc" | "name-desc";
}

export default async function loader(
  {
    skip = 0,
    take = 3,
    searchBy = "modelCode",
    customPathname = "guias-y-manuales",
    sortBy = "name-asc",
    ...rest
  }: Props,
  req: Request,
  ctx: AppContext & RecordsContext,
): Promise<Product[] | null> {
  const url = new URL(req.url);
  const term = rest.term ?? url.searchParams.get("q");
  const { language } = ctx;
  const handledCustomPathname = customPathname.replace(/^\/+|\/+$/g, "");
  const orderClause = language === "EN"
    ? products.alternateName
    : products.name;

  if (!term) {
    return null;
  }

  const records = await ctx.invoke.records.loaders.drizzle();
  const baseProducts = await records.select({
    name: products.name,
    alternateName: products.alternateName,
    productID: products.productID,
    url: products.url,
    sku: products.sku,
    gtin: products.gtin,
  }).from(products).leftJoin(
    avaliableIn,
    eq(products.sku, avaliableIn.subjectOf),
  ).where(
    and(
      sql`${url.hostname} LIKE '%' || ${avaliableIn.domain}`,
      sql`${DATABASE_FIELDS[searchBy]} LIKE '%' || ${term} ||'%'`,
    ),
  ).orderBy(
    sortBy === "name-asc" ? asc(orderClause) : desc(orderClause),
  ).groupBy(products.sku).offset(skip).limit(take).then((res) =>
    res as unknown as BaseProduct[]
  )
    .catch((e) => {
      console.log(e);
      return null;
    });

  if (!baseProducts || baseProducts.length === 0) {
    return null;
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

  return baseProducts.map<Product>((p) => {
    return {
      "@type": "Product",
      name: language === "EN" ? p.alternateName ?? p.name : p.name,
      sku: p.sku,
      productID: p.productID ?? "",
      gtin: p.gtin ?? undefined,
      url: new URL(
        `${handledCustomPathname}/${pickUrlComposed(p, searchBy)}/p`,
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
  });
}
