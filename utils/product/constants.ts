import { AvailableIcons } from "../../components/ui/Icon.tsx";
import { products } from "../../db/schema.ts";
import { BaseProduct, UrlComposing } from "../../loaders/guides/products.ts";
import { LANGUAGE_DIFFS } from "../constants.tsx";

export const DEFAULT_DOMAINS = ["deno.dev", "decocdn.com", "localhost"];

export const iconMap: Record<string, AvailableIcons> = {
  WIDTH: "width-property",
  HEIGHT: "height-property",
  WEIGHT: "weight-property",
  DEPTH: "depth-property",
  BOX_WIDTH: "width-property",
  BOX_HEIGHT: "height-property",
  BOX_WEIGHT: "weight-property",
  BOX_DEPTH: "depth-property",
};

export type SortOptions = "name-asc" | "name-desc";

export const getSortOptions = (language: "EN" | "ES") => {
  return [
    { value: "name-asc", label: LANGUAGE_DIFFS[language].listingPage.nameAsc },
    {
      value: "name-desc",
      label: LANGUAGE_DIFFS[language].listingPage.nameDesc,
    },
  ];
};

export const DEFAULT_URL_PARAMS_TO_EXCLUDE = ["sort", "page"];

export const EXTENDED_URL_PARAMS_TO_EXCLUDE = [
  ...DEFAULT_URL_PARAMS_TO_EXCLUDE,
  "onlyProducts",
  "__cb",
  "__decoFBT",
  "__d",
  "path",
  "pathTemplate",
  "deviceHint",
];

export const MEASUREMENTS_KEYS = ["height", "width", "depth", "weight"];

export const GUIDE_PROPERTY_ID = "GUIDE";

export const DATABASE_FIELDS = {
  "slug": products.url,
  "sku": products.sku,
  "modelCode": products.productID,
  "gtin": products.gtin,
};

export const TIME_UNITS = [
  { unit: "Año", seconds: 31536000, plural: "s" },
  { unit: "Mes", seconds: 2592000, plural: "es" },
  { unit: "Sem", seconds: 604800, plural: "s" },
  { unit: "Día", seconds: 86400, plural: "s" },
  { unit: "Hora", seconds: 3600, plural: "s" },
  { unit: "Min.", seconds: 60, plural: "" },
];

export const TIME_UNITS_EN = [
  { unit: "Year", seconds: 31536000, plural: "s" },
  { unit: "Month", seconds: 2592000, plural: "s" },
  { unit: "Week", seconds: 604800, plural: "s" },
  { unit: "Day", seconds: 86400, plural: "s" },
  { unit: "Hour", seconds: 3600, plural: "s" },
  { unit: "Min.", seconds: 60, plural: "" },
];

export const pickUrlComposed = (
  product: BaseProduct,
  urlComposing: UrlComposing,
) => {
  if (urlComposing === "slug") {
    return product.url;
  }
  if (urlComposing === "sku") {
    return product.sku;
  }
  if (urlComposing === "modelCode") {
    return product.productID;
  }
  if (urlComposing === "gtin") {
    return product.gtin;
  }
};

export const AVAILABLE_CATEGORIES_REGEX =
  /^(?<categoryId>[^-][\w-]+)---(?<categoryName>[^-](?:[^-]|-(?!--))+)---(?<categoryLevel>\d+)$/;

export const AVAILABLE_BRANDS_REGEX =
  /^(?<brandId>[^-][\w-]+)---(?<brandName>[^-](?:[^-]|-(?!--))+)$/;
