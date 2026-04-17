import {
  BreadcrumbList,
  FilterToggle,
  Product,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { AppContext } from "apps/records/mod.ts";
import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";
import { Category, ProductMeasurements } from "../../../utils/types.ts";
import { LibSQLDatabase } from "apps/records/deps.ts";
import {
  additionalProperties,
  avaliableIn,
  brands,
  filtersGroups,
  images,
  productCategories,
  productMeasurements,
  products,
} from "../../../db/schema.ts";
import { logger } from "@deco/deco/o11y";
import {
  getSortOptions,
  SortOptions,
} from "../../../utils/product/constants.ts";
import { AppContext as ModContext } from "../../../mod.ts";
import { LANGUAGE_DIFFS } from "../../../utils/constants.tsx";
import { getFiltersFromUrl, getUrlFilter } from "../../../utils/utils.ts";
import {
  getCategoryBranch,
  getCategoryTree,
} from "../../../utils/product/getProduct.ts";

export interface ExtendedCategory extends Category {
  additionalType?: string;
}

interface AdditionalPropertiesFilters {
  identifier: string;
  name: string;
  alternateName: string | null;
  value: string;
  alternateValue: string | null;
  unitText: string | null;
  alternateUnitText: string | null;
}

export interface Props {
  recordsPerPage: number;
  page?: number;
  sort?: SortOptions;
  /**
   * @ignore
   */
  returnOnlyProducts?: boolean;
}

/**
 * @title ProductListing from Deco Records
 * @description Retrieves a product listing from Deco Records.
 *
 * @param props - The props for the product listing.
 * @param req - The request object.
 * @param ctx - The application context.
 * @returns A promise that resolves to a product listing.
 */
export default async function loader(
  { recordsPerPage = 20, page, sort, returnOnlyProducts }: Props,
  req: Request,
  ctx: AppContext | ModContext,
): Promise<ProductListingPage | null> {
  const url = new URL(req.url);
  const pageNumber = page ?? Number(url.searchParams.get("page") ?? 1);
  const sortOption = sort ?? url.searchParams.get("sort") ?? "name-asc";
  const onlyProducts = returnOnlyProducts ??
    url.searchParams.get("onlyProducts") === "true";
  const { filtersFromUrl, measurementsFromUrl } = getFiltersFromUrl(url);
  const ctxRecords = ctx as AppContext;
  const { language } = ctx as ModContext;
  const records = await ctxRecords.invoke.records.loaders.drizzle();
  const paths = url.pathname.split("/").splice(1);

  //This is the category tree that will be used to get the SKUs
  const categoryTree = await getCategoryTree(records, paths[0]);

  if (!checkPath(paths, categoryTree)) {
    //If the path is wrong or malformed, return null
    return null;
  }

  //This is the searched category
  const searchedCategory = categoryTree.find(({ identifier }) =>
    identifier === paths[paths.length - 1]
  );

  //This is the category branch that will be used to get the SKUs
  const categoryBranch = searchedCategory?.additionalType === "1"
    ? categoryTree.map((
      { identifier, name, alternateName, additionalType },
    ) => ({
      identifier,
      name,
      alternateName,
      additionalType,
    }))
    : getCategoryBranch(categoryTree, searchedCategory!);

  //This extensive query get all the SKUs that match the category, domain, filters and measurements
  const skusToGet = await records.select({
    product: productCategories.product,
  }).from(productCategories)
    .leftJoin(
      avaliableIn,
      eq(productCategories.product, avaliableIn.subjectOf),
    )
    .leftJoin(
      additionalProperties,
      eq(productCategories.product, additionalProperties.subjectOf),
    )
    .leftJoin(
      productMeasurements,
      eq(productCategories.product, productMeasurements.subjectOf),
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
    .having(
      and(
        filtersFromUrl //This is the query to get the SKUs that match the filters
          ? and(
            ...Array.from(filtersFromUrl.entries()).map(([key, values]) => {
              return sql`SUM(CASE WHEN ${additionalProperties.additionalType} = ${key} AND ${
                inArray(additionalProperties.value, values)
              } THEN 1 ELSE 0 END) > 0`;
            }),
          )
          : undefined,
        measurementsFromUrl //This is the query to get the SKUs that match the measurements
          ? and(
            ...Array.from(measurementsFromUrl.entries()).map(
              ([key, ranges]) => {
                return sql`SUM(CASE WHEN ${productMeasurements.propertyID} = ${key.toUpperCase()} AND ${
                  or(
                    ...ranges.map((range) => {
                      const [min, max] = range.split("-").map(Number);
                      return sql`(${productMeasurements.minValue} >= ${min} AND ${productMeasurements.minValue} <= ${
                        max + 0.99
                      })`;
                    }),
                  )
                } THEN 1 ELSE 0 END) > 0`;
              },
            ),
          )
          : undefined,
      ),
    )
    .groupBy(productCategories.product);

  if (!skusToGet.length || !skusToGet[0].product) return null;

  const sortOptions = getSortOptions(language);

  const products = await getProductData(
    records,
    skusToGet,
    url,
    pageNumber,
    recordsPerPage,
    sortOptions.map((opt) => opt.value).includes(sortOption)
      ? sortOption as SortOptions
      : "name-asc",
    onlyProducts,
    language,
  );

  if (!products) return null;

  const totalProducts = skusToGet.length;
  const totalPages = Math.ceil(totalProducts / recordsPerPage);
  const currentPage = Number(pageNumber);

  return {
    "@type": "ProductListingPage",
    breadcrumb: getBreadcrumbList(paths, categoryTree, url, language),
    products: products.productData,
    filters: onlyProducts ? [] : [
      ...(getCategoryFilters(
        categoryBranch,
        language,
        searchedCategory!,
        url,
      ) ?? []),
      ...(products.measurements
        ? getMeasurementsFilters(products.measurements, language, url)
        : []),
      ...(products.productProperties
        ? getProductPropertiesFilters(
          products.productProperties,
          language,
          url,
        )
        : []),
    ],
    pageInfo: {
      currentPage,
      nextPage: currentPage < totalPages
        ? `?page=${currentPage + 1}`
        : undefined,
      previousPage: currentPage > 1 ? `?page=${currentPage - 1}` : undefined,
      records: totalProducts,
      recordPerPage: recordsPerPage,
    },
    sortOptions,
    seo: {
      title: language === "EN"
        ? searchedCategory?.alternateName ?? searchedCategory?.name ?? ""
        : searchedCategory?.name ?? "",
      description: searchedCategory?.description ?? "",
      canonical: new URL(url.pathname, url.origin).href,
    },
  };
}

const getProductPropertiesFilters = (
  productProperties: AdditionalPropertiesFilters[],
  language: "EN" | "ES",
  url: URL,
): FilterToggle[] => {
  const groupedProperties = productProperties.reduce((acc, prop) => {
    const values = acc[prop.identifier] || { items: [], counts: {} };
    if (!values.items.find((v) => v.value === prop.value)) {
      values.items.push({
        name: prop.name,
        alternateName: prop.alternateName,
        value: prop.value,
        unitText: prop.unitText,
        alternateValue: prop.alternateValue,
        alternateUnitText: prop.alternateUnitText,
      });
    }
    values.counts[prop.value] = (values.counts[prop.value] || 0) + 1;
    return { ...acc, [prop.identifier]: values };
  }, {} as Record<string, {
    items: Omit<AdditionalPropertiesFilters, "identifier">[];
    counts: Record<string, number>;
  }>);

  return Object.entries(groupedProperties).map(
    ([identifier, { items, counts }]) => {
      const filterKey = identifier.toLowerCase();
      const filterFromUrl = url.searchParams.get(filterKey);
      const propertyName = language === "EN"
        ? items[0].alternateName || items[0].name
        : items[0].name;

      const filterValues = items.map(
        ({ value, alternateValue, unitText, alternateUnitText }) => {
          const { urlWithFilter, selected } = getUrlFilter(
            value,
            url,
            filterKey,
            filterFromUrl ?? undefined,
          );
          const [label, unit] = language === "EN"
            ? [alternateValue ?? value, alternateUnitText ?? unitText]
            : [value, unitText];

          return {
            label: unit ? `${label} ${unit}` : label,
            value,
            quantity: counts[value],
            selected,
            url: urlWithFilter,
          };
        },
      );

      return {
        "@type": "FilterToggle",
        label: propertyName,
        key: filterKey,
        values: filterValues,
        quantity: filterValues.length,
      };
    },
  );
};

const getCategoryFilters = (
  categoryBranch: ExtendedCategory[],
  language: "EN" | "ES",
  searchedCategory: ExtendedCategory,
  url: URL,
): FilterToggle[] | null => {
  const categoryLevelToGet = (Number(searchedCategory.additionalType) + 1)
    .toString();

  const categoryValues = categoryBranch
    .filter((c) => c.additionalType === categoryLevelToGet)
    .map((c) => ({
      label: language === "EN" ? c.alternateName ?? c.name : c.name,
      value: c.identifier,
      quantity: 0,
      selected: false,
      url: new URL(`${url.pathname}/${c.identifier}`, url.origin).href,
    }));

  if (categoryValues.length === 0) {
    return null;
  }

  return [
    {
      "@type": "FilterToggle",
      label: LANGUAGE_DIFFS[language].plpLoader.category,
      key: "categoria",
      values: categoryValues,
      quantity: categoryValues.length,
    },
  ];
};

const getMeasurementsFilters = (
  measurements: ProductMeasurements[],
  language: "EN" | "ES",
  url: URL,
): FilterToggle[] => {
  const groupedByProperty = measurements.reduce(
    (acc, { propertyID, minValue, unitCode }) => ({
      ...acc,
      [propertyID]: [...(acc[propertyID] || []), { minValue, unitCode }],
    }),
    {} as Record<string, { minValue: number; unitCode: string }[]>,
  );
  const propertyLabels = LANGUAGE_DIFFS[language].plpLoader;

  return Object.entries(groupedByProperty).map(([propertyID, values]) => {
    const min = Math.min(...values.map((v) => v.minValue));
    const max = Math.max(...values.map((v) => v.minValue));
    const filterKey = propertyID.toLowerCase();
    const filterFromUrl = url.searchParams.get(filterKey);
    const unitCode = values[0]?.unitCode ?? "";
    const rangeSize = 10;
    const ranges: { start: number; end: number }[] = [];
    const startRange = Math.floor((min === 0 ? (min - 1) : min) / rangeSize) *
      rangeSize;
    const endRange = Math.ceil(max / rangeSize) * rangeSize;
    for (let start = startRange; start < endRange; start += rangeSize) {
      ranges.push({
        start: start === 0 ? 0 : start + 1,
        end: start + rangeSize,
      });
    }

    const rangeValues = ranges
      .map(({ start, end }) => {
        const quantity = values.filter((v) =>
          v.minValue >= start && v.minValue <= (end + 0.99)
        ).length;
        if (quantity === 0) {
          return null;
        }
        const value = `${start}-${end}`;
        const { urlWithFilter, selected } = getUrlFilter(
          value,
          url,
          filterKey,
          filterFromUrl ?? undefined,
        );

        return {
          label: `${value} ${unitCode}`,
          value,
          quantity,
          selected,
          url: urlWithFilter,
        };
      })
      .filter((value): value is NonNullable<typeof value> => Boolean(value));

    return {
      "@type": "FilterToggle",
      label: propertyLabels[propertyID as keyof typeof propertyLabels],
      key: filterKey,
      values: rangeValues,
      quantity: rangeValues.length,
    };
  });
};

const getBreadcrumbList = (
  pathnames: string[],
  categoryTree: ExtendedCategory[],
  url: URL,
  language: "EN" | "ES",
): BreadcrumbList => {
  return {
    "@type": "BreadcrumbList",
    itemListElement: pathnames.map((pathname, index) => {
      const category = categoryTree.find(({ identifier }) =>
        identifier === pathname
      );
      return {
        "@type": "ListItem",
        position: index + 1,
        item: language === "EN"
          ? category?.alternateName ?? category?.name ?? ""
          : category?.name ?? "",
        url: new URL(pathnames.slice(0, index + 1).join("/"), url.origin).href,
        image: category?.image
          ? [{
            "@type": "ImageObject",
            url: category.image,
          }]
          : undefined,
        description: language === "EN"
          ? category?.alternateDescription
          : category?.description,
      };
    }),
    numberOfItems: pathnames.length,
  };
};

const getProductData = async (
  records: LibSQLDatabase<Record<string, never>>,
  skusToGet: {
    product: string | null;
  }[],
  url: URL,
  page: number = 1,
  recordsPerPage: number = 20,
  sortBy: SortOptions,
  onlyProducts: boolean = false,
  language: "EN" | "ES" = "ES",
): Promise<
  {
    productData: Product[];
    productProperties?: AdditionalPropertiesFilters[];
    measurements?: ProductMeasurements[];
  } | null
> => {
  const orderClause = language === "EN"
    ? products.alternateName
    : products.name;
  const offset = (page - 1) * recordsPerPage;
  const baseProductData = await records.select({
    name: products.name,
    productID: products.productID,
    url: products.url,
    sku: products.sku,
    gtin: products.gtin,
    brand_name: brands.name,
    brand_id: brands.identifier,
    alternateName: products.alternateName,
  })
    .from(products)
    .innerJoin(brands, eq(products.brand, brands.identifier))
    .where(
      inArray(
        products.sku,
        skusToGet.map((sku) => sku.product!),
      ),
    )
    .groupBy(products.sku)
    .orderBy(sortBy === "name-asc" ? asc(orderClause) : desc(orderClause))
    .limit(recordsPerPage)
    .offset(offset);

  if (!baseProductData.length) return null;

  const [productImages, productProperties, measurements] = await Promise
    .all([
      records //Get product images ONLY from products that will be shown in the page
        .select()
        .from(images)
        .where(
          inArray(images.subjectOf, baseProductData.map((p) => p.sku)),
        )
        .all(),
      !onlyProducts
        ? records //Get productProperties filters from ALL products
          .select({
            identifier: filtersGroups.identifier,
            name: filtersGroups.name,
            alternateName: filtersGroups.alternateName,
            value: additionalProperties.value,
            unitText: additionalProperties.unitText,
            alternateValue: additionalProperties.alternateValue,
            alternateUnitText: additionalProperties.alternateUnitText,
          })
          .from(additionalProperties)
          .innerJoin(
            filtersGroups,
            eq(additionalProperties.additionalType, filtersGroups.identifier),
          )
          .where(
            inArray(
              additionalProperties.subjectOf,
              skusToGet.map((p) => p.product!),
            ),
          )
          .all()
        : undefined,
      !onlyProducts
        ? records //Get measurements from ALL products
          .select()
          .from(productMeasurements)
          .where(
            inArray(
              productMeasurements.subjectOf,
              skusToGet.map((p) => p.product!),
            ),
          )
          .all()
        : undefined,
    ]);

  return {
    productData: baseProductData.map<Product>((p) => ({
      "@type": "Product",
      name: language === "EN" ? p.alternateName ?? p.name : p.name,
      sku: p.sku,
      productID: p.productID ?? "",
      gtin: p.gtin ?? undefined,
      url: new URL(
        `${p.url}/p`,
        url.origin,
      ).href,
      brand: {
        "@type": "Brand",
        name: p.brand_name,
        identifier: p.brand_id,
      },
      image: productImages.filter((i) => i.subjectOf === p.sku).map((i) => ({
        "@type": "ImageObject" as const,
        ...i,
        name: i.name ?? undefined,
        description: i.description ?? undefined,
        disambiguatingDescription: i.disambiguatingDescription ?? undefined,
        subjectOf: i.subjectOf ?? undefined,
        identifier: String(i.identifier),
        additionalType: i.additionalType ?? undefined,
      })),
    })),
    productProperties,
    measurements: measurements as unknown as ProductMeasurements[] | undefined,
  };
};

const checkPath = (paths: string[], categories: ExtendedCategory[]) =>
  paths.reduce(
    (acc, p, index) => {
      if (acc === false) {
        return false;
      }
      const category = categories.find(({ identifier }) => identifier === p);
      if (
        category &&
        ((index === 0 && category.additionalType === "1") ||
          category.subjectOf === paths[index - 1])
      ) {
        return true;
      }
      return false;
    },
    true,
  );

export const cache = "stale-while-revalidate";

export const cacheKey = (
  { page, sort, recordsPerPage = 20, returnOnlyProducts }: Props,
  req: Request,
  { language }: ModContext,
) => {
  const url = new URL(req.url);
  const cacheKey = new URL(url.pathname, url.origin);
  const pageNumber = page ?? Number(url.searchParams.get("page") ?? 1);
  const sortOption = sort ?? url.searchParams.get("sort") ?? "name-asc";
  const onlyProducts = returnOnlyProducts ??
    url.searchParams.get("onlyProducts") === "true";

  cacheKey.searchParams.set("page", pageNumber.toString());
  cacheKey.searchParams.set("sort", sortOption);
  cacheKey.searchParams.set("recordsPerPage", recordsPerPage.toString());
  cacheKey.searchParams.set("onlyProducts", onlyProducts.toString());
  cacheKey.searchParams.set("language", language);

  const { filtersFromUrl, measurementsFromUrl } = getFiltersFromUrl(url);

  if (filtersFromUrl) {
    filtersFromUrl.forEach((values, key) => {
      cacheKey.searchParams.set(key.toLowerCase(), values.join("_"));
    });
  }
  if (measurementsFromUrl) {
    measurementsFromUrl.forEach((ranges, key) => {
      cacheKey.searchParams.set(key.toLowerCase(), ranges.join("_"));
    });
  }
  return cacheKey.href;
};
