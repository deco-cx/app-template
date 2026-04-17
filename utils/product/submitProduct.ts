import {
  AdditionalProperty,
  AvaliableIn,
  ImageProduct,
  Measurements,
  Product,
  ProductCategory,
  ProductDocument,
  Video,
} from "../types.ts";
import {
  additionalProperties,
  avaliableIn,
  descriptions,
  images,
  productCategories,
  productDocuments,
  productMeasurements,
  products,
  videos,
} from "../../db/schema.ts";
import { Props as SubmitProductProps } from "../../actions/product/createProduct.ts";
import { Description } from "../types.ts";
import { and, eq } from "drizzle-orm";
import { DEFAULT_DOMAINS } from "./constants.ts";
import {
  isValidMeasurements,
  matchAvaliableBrandsLoaderPattern,
  matchAvaliableCategoriesLoaderPattern,
} from "../utils.ts";
import { Category as CategoryFromDatabase } from "./getProduct.ts";
import { LibSQLDatabase } from "apps/records/deps.ts";

export async function insertBaseData(
  product: Product,
  records: LibSQLDatabase<Record<string, never>>,
) {
  const { brandId } = matchAvaliableBrandsLoaderPattern(product.brand) ?? {};
  await records.insert(products).values({
    ...product,
    brand: brandId ?? "",
  });
}

export async function insertCategories(
  categories: ProductCategory[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records.insert(productCategories).values(
    categories.map(({ subjectOf }) => {
      const { categoryId } = matchAvaliableCategoriesLoaderPattern(subjectOf) ??
        {};
      return {
        subjectOf: categoryId,
        product: sku,
      };
    }),
  );
}

export async function insertMeasurements(
  measurements: Measurements,
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records.insert(productMeasurements).values(
    Object.entries(measurements).map(([key, value]) => {
      return {
        ...value,
        subjectOf: sku,
        propertyID: key.toUpperCase(),
      };
    }),
  );
}

export async function insertAdditionalProperties(
  productProps: AdditionalProperty[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records.insert(additionalProperties).values(
    productProps.map((props) => {
      return {
        ...props,
        subjectOf: sku,
      };
    }),
  );
}

export async function insertDescriptions(
  productProps: Description[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records.insert(descriptions).values(
    productProps.map((props) => {
      return {
        ...props,
        subjectOf: sku,
      };
    }),
  );
}

export async function insertImages(
  productImages: ImageProduct[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records.insert(images).values(
    productImages.map((props) => {
      return {
        ...props,
        subjectOf: sku,
      };
    }),
  );
}

export async function insertVideos(
  productVideo: Video[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records.insert(videos).values(
    productVideo.map((props) => {
      return {
        ...props,
        subjectOf: sku,
      };
    }),
  );
}

export async function insertAvaliability(
  avaliablility: AvaliableIn[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
  omitDefaultDomains = false,
) {
  await records.insert(avaliableIn).values([
    ...avaliablility.map(({ domain }) => ({
      domain,
      subjectOf: sku,
    })),
    ...(omitDefaultDomains ? [] : DEFAULT_DOMAINS.map((domain) => ({
      domain,
      subjectOf: sku,
    }))),
  ]);
}

export async function insertDocuments(
  documents: ProductDocument[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records.insert(productDocuments).values(
    documents.map((props) => {
      return {
        ...props,
        subjectOf: sku,
      };
    }),
  );
}

export async function insertProduct(
  {
    product,
    categories,
    additionalProperties,
    avaliableIn,
    descriptions,
    images,
    videos,
    measurements,
    documents,
    records,
  }: SubmitProductProps & { records: LibSQLDatabase<Record<string, never>> },
) {
  if (
    categories.length === 0 || additionalProperties.length === 0 ||
    images.length === 0 || !isValidMeasurements(measurements)
  ) {
    throw new Error("Invalid product data");
  }

  await insertBaseData(product, records);
  await insertMeasurements(measurements, product.sku, records);
  await insertCategories(categories, product.sku, records);
  await insertAdditionalProperties(additionalProperties, product.sku, records);
  await insertImages(images, product.sku, records);
  if (avaliableIn && avaliableIn.length > 0) {
    await insertAvaliability(avaliableIn, product.sku, records);
  }
  if (descriptions && descriptions.length > 0) {
    await insertDescriptions(descriptions, product.sku, records);
  }
  if (videos && videos.length > 0) {
    await insertVideos(videos, product.sku, records);
  }
  if (documents && documents.length > 0) {
    await insertDocuments(documents, product.sku, records);
  }
}

export async function overrideBaseData(
  product: Partial<Product>,
  records: LibSQLDatabase<Record<string, never>>,
) {
  const updateData: Partial<Product> = {};
  Object.keys(product).forEach((key) => {
    const value = product[key as keyof Product];
    if (value) {
      updateData[key as keyof Product] = value;
    }
  });
  if (Object.keys(updateData).length > 0) {
    await records
      .update(products)
      .set(updateData)
      .where(eq(products.sku, product.sku!));
  }
}

export async function overrideDocuments(
  documents: ProductDocument[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records
    .delete(productDocuments)
    .where(eq(productDocuments.subjectOf, sku));
  if (documents && documents.length > 0) {
    await insertDocuments(documents, sku, records);
  }
}

export async function overrideMeasurements(
  measurements: Partial<Measurements>,
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  const measurementsArray = Object.entries(measurements).map(([key, value]) => {
    return {
      ...value,
      subjectOf: sku,
      propertyID: key.toUpperCase(),
    };
  });
  const promises = measurementsArray.map((measurement) => {
    return records.update(productMeasurements).set(measurement).where(and(
      eq(productMeasurements.subjectOf, sku),
      eq(productMeasurements.propertyID, measurement.propertyID),
    ));
  });
  await Promise.all(promises);
}

export async function overrideAdditionalProperties(
  productProps: AdditionalProperty[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  if (!productProps || productProps.length === 0) {
    throw new Error("Product MUST have additional properties");
  }
  await records.delete(additionalProperties).where(
    eq(additionalProperties.subjectOf, sku),
  );
  await insertAdditionalProperties(productProps, sku, records);
}

export async function overrideCategories(
  categories: ProductCategory[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  if (!categories || categories.length === 0) {
    throw new Error("Product MUST have categories");
  }
  await records.delete(productCategories).where(
    eq(productCategories.product, sku),
  );

  await insertCategories(categories, sku, records);
}

export async function overrideImages(
  override: ImageProduct[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  if (!override || override.length === 0) {
    throw new Error("Product MUST have images");
  }
  await records.delete(images).where(eq(images.subjectOf, sku));
  await insertImages(override, sku, records);
}

export async function overrideVideos(
  override: Video[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records.delete(videos).where(eq(videos.subjectOf, sku));
  if (override && override.length > 0) {
    await insertVideos(override, sku, records);
  }
}

export async function overrideProductDescriptions(
  override: Description[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  if (!override || override.length === 0) {
    throw new Error("Product MUST have descriptions");
  }
  await records.delete(descriptions).where(eq(descriptions.subjectOf, sku));
  await insertDescriptions(override, sku, records);
}

export async function overrideAvaliability(
  avaliability: AvaliableIn[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  await records.delete(avaliableIn).where(eq(avaliableIn.subjectOf, sku));
  if (avaliability && avaliability.length > 0) {
    await insertAvaliability(avaliability, sku, records);
  }
}

export async function addCategories(
  categories: ProductCategory[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  const productCategoriesFromRecords = await getProductCategories(sku, records);
  const categoriesToInsert = categories.filter((c) =>
    !productCategoriesFromRecords.find((productCat) =>
      productCat.subjectOf ===
        matchAvaliableCategoriesLoaderPattern(c.subjectOf)?.categoryId
    )
  );
  if (categoriesToInsert.length > 0) {
    await insertCategories(categoriesToInsert, sku, records);
  }
  return getProductCategories(sku, records);
}

export async function addAvaliability(
  avaliability: AvaliableIn[],
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) {
  const avaliabilityFromRecords = await getProductAvaliability(sku, records);
  const avaliabilityToInsert = avaliability.filter((a) =>
    !avaliabilityFromRecords.find((aFromRecords) =>
      aFromRecords.domain === a.domain
    )
  );
  if (avaliabilityToInsert.length > 0) {
    await insertAvaliability(avaliabilityToInsert, sku, records, true);
  }
  return getProductAvaliability(sku, records);
}

const getProductAvaliability = async (
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) =>
  await records
    .select()
    .from(avaliableIn)
    .where(eq(avaliableIn.subjectOf, sku)) as AvaliableIn[];

const getProductCategories = async (
  sku: string,
  records: LibSQLDatabase<Record<string, never>>,
) =>
  await records
    .select()
    .from(productCategories)
    .where(eq(productCategories.product, sku)) as CategoryFromDatabase[];
