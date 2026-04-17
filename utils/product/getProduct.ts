import { type AppContext } from "apps/records/mod.ts";

import { AppContext as ModContext } from "../../mod.ts";
import {
  additionalProperties,
  avaliableIn,
  brands,
  descriptions,
  domains,
  images,
  productMeasurements,
  products,
  videos,
} from "../../db/schema.ts";
import { eq, sql } from "drizzle-orm";
import { Product, PropertyValue } from "apps/commerce/types.ts";
import { LANGUAGE_DIFFS } from "../../utils/constants.tsx";
import { LibSQLDatabase } from "apps/records/deps.ts";
import { ExtendedCategory } from "../../loaders/product/listing/productListing.ts";

interface ProductBase {
  sku: string;
  name: string;
  alternateName?: string;
  productID: string;
  url: string;
  description: string | null;
  alternateDescription?: string;
  gtin: string | null;
  brand_name: string;
  brand_id: string;
}

interface AdditionalProperty {
  additionalType: string | null;
  name: string;
  alternateName: string | null;
  value: string;
  alternateValue: string | null;
  unitText: string | null;
  alternateUnitText: string | null;
}

export interface Description {
  name: string;
  alternateName: string | null;
  identifier: number;
  subjectOf: string | null;
  value: string;
  alternateValue: string | null;
  image: string | null;
}

export interface Image {
  url: string;
  identifier: number;
  disambiguatingDescription: string | null;
  subjectOf: string | null;
}

export interface Video {
  identifier: number;
  subjectOf: string | null;
  contentUrl: string;
  thumbnailUrl: string;
}

export interface Category {
  identifier: string;
  name: string;
  alternateName?: string;
  subjectOf: string | null;
}

interface Avaliability {
  identifier: string;
  description: string;
}

interface Measurement {
  identifier: number;
  subjectOf: string | null;
  propertyID: string;
  unitCode: string | null;
  maxValue: number | null;
  minValue: number | null;
}

export async function getProduct(
  identifier: string,
  ctx: AppContext | ModContext,
  url: URL,
  useSkuAsSlug = false,
): Promise<Product | null> {
  const recordsCtx = ctx as AppContext;
  const records = await recordsCtx.invoke.records.loaders.drizzle();
  const productBase = await records
    .select({
      sku: products.sku,
      name: products.name,
      alternateName: products.alternateName,
      productID: products.productID,
      url: products.url,
      description: products.description,
      alternateDescription: products.alternateDescription,
      gtin: products.gtin,
      brand_name: brands.name,
      brand_id: brands.identifier,
    })
    .from(products)
    .innerJoin(brands, eq(products.brand, brands.identifier))
    .where(eq(useSkuAsSlug ? products.sku : products.url, identifier))
    .get();

  if (!productBase) {
    return null;
  }

  const [
    additionalProperty,
    description,
    image,
    video,
    category,
    avaliability,
    measurements,
  ] = await Promise.all([
    records
      .select()
      .from(additionalProperties)
      .where(eq(additionalProperties.subjectOf, productBase.sku))
      .all(),

    records
      .select()
      .from(descriptions)
      .where(eq(descriptions.subjectOf, productBase.sku))
      .all(),

    records
      .select()
      .from(images)
      .where(eq(images.subjectOf, productBase.sku))
      .all(),

    records
      .select()
      .from(videos)
      .where(eq(videos.subjectOf, productBase.sku))
      .all(),

    records.run(sql`
        WITH RECURSIVE CategoryHierarchy AS (
          SELECT
            c.identifier,
            c.name,
            c.alternateName,
            c.subjectOf
          FROM
            productCategories AS pc
            INNER JOIN categories AS c ON pc.subjectOf = c.identifier
          WHERE
            pc.product = ${productBase.sku}
          UNION
          SELECT
            parent.identifier,
            parent.name,
            parent.alternateName,
            parent.subjectOf
          FROM
            categories AS parent
            INNER JOIN CategoryHierarchy AS child ON child.subjectOf = parent.identifier
        )
        SELECT
          *
        FROM
          CategoryHierarchy
        `),

    records
      .select({
        identifier: domains.identifier,
        description: domains.description,
      })
      .from(avaliableIn)
      .innerJoin(domains, eq(avaliableIn.domain, domains.identifier))
      .where(eq(avaliableIn.subjectOf, productBase.sku))
      .all(),

    records
      .select()
      .from(productMeasurements)
      .where(eq(productMeasurements.subjectOf, productBase.sku))
      .all(),
  ]);

  const isAvaliable = avaliability.some(({ identifier }) =>
    url.hostname.endsWith(identifier)
  );

  return isAvaliable
    ? productsObject(
      {
        productBase,
        additionalProperty,
        description,
        image,
        video,
        category: category.rows as unknown as Category[],
        avaliability,
        url,
        measurements,
        ctx: ctx as ModContext,
      },
    )
    : null;
}

export const getCategoryTree = async (
  records: LibSQLDatabase<Record<string, never>>,
  fatherCategoryPath: string,
) =>
  await records.run(sql`
    WITH RECURSIVE
    CategoryTree AS (
      SELECT
        identifier,
        name,
        alternateName,
        description,
        alternateDescription,
        additionalType,
        subjectOf,
        image
      FROM
        categories
      WHERE
        identifier = ${fatherCategoryPath}
      UNION ALL
      SELECT
        c.identifier,
        c.name,
        c.alternateName,
        c.description,
        c.alternateDescription,
        c.additionalType,
        c.subjectOf,
        c.image
      FROM
        categories c
        INNER JOIN CategoryTree ct ON c.subjectOf = ct.identifier
    )
  SELECT
    *
  FROM
    CategoryTree;
    `).then((result) => result.rows) as unknown as ExtendedCategory[];

export const getCategoryBranch = (
  categories: ExtendedCategory[],
  searchedCategory: ExtendedCategory,
): {
  identifier: string;
  name: string;
  alternateName?: string;
  additionalType?: string;
}[] => {
  const getChildIdentifiers = (parentIds: string[]): string[] =>
    parentIds.length === 0 ? [] : [
      ...parentIds,
      ...getChildIdentifiers(
        categories
          .filter((cat) => parentIds.includes(cat.subjectOf ?? ""))
          .map((cat) => cat.identifier),
      ),
    ];

  return getChildIdentifiers([searchedCategory.identifier]).map(
    (identifier) => {
      const { name, alternateName, additionalType } = categories.find((cat) =>
        cat.identifier === identifier
      )!;
      return {
        identifier,
        name,
        alternateName,
        additionalType,
      };
    },
  );
};

function productsObject(
  {
    productBase,
    additionalProperty,
    description,
    category,
    avaliability,
    image,
    video,
    url,
    skuAsSlug,
    measurements,
    ctx,
  }: {
    productBase: ProductBase;
    additionalProperty: AdditionalProperty[];
    description: Description[];
    category: Category[];
    avaliability: Avaliability[];
    image: Image[];
    video: Video[];
    url: URL;
    skuAsSlug?: boolean;
    measurements: Measurement[];
    ctx: ModContext;
  },
): Product {
  const productUrl = new URL(
    skuAsSlug ? `${productBase.sku}/p` : `${productBase.url}/p`,
    url.origin,
  );
  const language = ctx.language;

  return {
    "@type": "Product",
    name: language === "EN"
      ? productBase.alternateName ?? productBase.name
      : productBase.name,
    sku: productBase.sku,
    productID: productBase?.productID ?? "",
    gtin: productBase.gtin ?? undefined,
    description: language === "EN"
      ? productBase.alternateDescription ?? productBase.description ?? ""
      : productBase.description ?? "",
    url: productUrl.href,
    brand: {
      "@type": "Brand",
      name: productBase.brand_name,
      identifier: productBase.brand_id,
    },
    additionalProperty: [
      ...measurements.reduce<PropertyValue[]>(
        (acc, { propertyID, maxValue, minValue, unitCode }) => {
          return [
            ...acc,
            {
              "@type": "PropertyValue" as const,
              propertyID,
              value: minValue !== null
                ? (Number.isInteger(minValue)
                  ? String(minValue)
                  : minValue.toFixed(2))
                : undefined,
              unitCode: unitCode ?? undefined,
              //@ts-ignore Is an keyof
              name: LANGUAGE_DIFFS[language].pdpLoader[propertyID],
            },
            {
              "@type": "PropertyValue" as const,
              propertyID: `BOX_${propertyID}`,
              value: maxValue !== null
                ? (Number.isInteger(maxValue)
                  ? String(maxValue)
                  : maxValue.toFixed(2))
                : undefined,
              unitCode: unitCode ?? undefined,
              //@ts-ignore Is an keyof
              name: LANGUAGE_DIFFS[language].pdpLoader[`BOX_${propertyID}`],
            },
          ];
        },
        [] as PropertyValue[],
      ),
      ...additionalProperty.map((prop) => {
        const [name, value, unitText] = language === "ES"
          ? [prop.name, prop.value, prop.unitText]
          : [
            prop.alternateName ?? prop.name,
            prop.alternateValue ?? prop.value,
            prop.alternateUnitText ?? prop.unitText,
          ];
        return {
          "@type": "PropertyValue" as const,
          propertyID: "OTHER",
          name,
          value,
          unitText,
        };
      }),
      ...description.map(
        ({ name, value, image, alternateName, alternateValue }) => {
          const [title, body] = language === "EN"
            ? [alternateName ?? name, alternateValue ?? value]
            : [name, value];
          return {
            "@type": "PropertyValue" as const,
            propertyID: "DESCRIPTION",
            name: title,
            value: body,
            image: [{
              "@type": "ImageObject" as const,
              url: image ?? undefined,
            }],
          };
        },
      ),
      ...category.map(({ identifier, name, alternateName, subjectOf }) => (
        {
          "@type": "PropertyValue" as const,
          propertyID: "CATEGORY",
          name: language === "EN" ? alternateName ?? name : name,
          value: identifier,
          subjectOf,
        }
      )),
      ...avaliability.map(({ identifier, description }) => (
        {
          "@type": "PropertyValue" as const,
          propertyID: "AVALIABLEIN",
          name: description,
          value: String(identifier),
        }
      )),
    ],
    image: image?.map((i) => {
      return {
        "@type": "ImageObject" as const,
        url: i.url ?? undefined,
        disambiguatingDescription: i.disambiguatingDescription ?? undefined,
        subjectOf: i.subjectOf ?? undefined,
        identifier: String(i.identifier),
      };
    }),
    video: video?.map((v) => ({
      "@type": "VideoObject" as const,
      ...v,
      identifier: String(v.identifier),
      subjectOf: v.subjectOf ?? undefined,
    })),
  };
}
