import {
  AVAILABLE_BRANDS_REGEX,
  AVAILABLE_CATEGORIES_REGEX,
  DEFAULT_URL_PARAMS_TO_EXCLUDE,
  EXTENDED_URL_PARAMS_TO_EXCLUDE,
  MEASUREMENTS_KEYS,
  TIME_UNITS,
  TIME_UNITS_EN,
} from "./product/constants.ts";
import { BaseMeasurement, Measurements } from "./types.ts";

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function getUrlFilter(
  value: string,
  url: URL,
  filterKey: string,
  filterFromUrl?: string,
) {
  const urlWithFilter = new URL(url.href);
  const urlValues = filterFromUrl?.split("_") ?? [];
  const selected = urlValues.includes(value);

  DEFAULT_URL_PARAMS_TO_EXCLUDE.forEach((param) =>
    urlWithFilter.searchParams.delete(param)
  );

  const newUrlValues = selected
    ? urlValues.filter((v) => v !== value)
    : [...urlValues, value];

  newUrlValues.length
    ? urlWithFilter.searchParams.set(filterKey, newUrlValues.join("_"))
    : urlWithFilter.searchParams.delete(filterKey);

  return { urlWithFilter: urlWithFilter.href, selected };
}

export function getFiltersFromUrl(url: URL) {
  const urlParams = new URLSearchParams(url.searchParams);
  EXTENDED_URL_PARAMS_TO_EXCLUDE.forEach((param) => urlParams.delete(param));

  const filtersFromUrl = new Map<string, string[]>();
  const measurementsFromUrl = new Map<string, string[]>();

  const sortedEntries = Array.from(urlParams.entries()).sort(([keyA], [keyB]) =>
    keyA.localeCompare(keyB)
  );

  for (const [key, value] of sortedEntries) {
    const sortedValues = value.split("_").sort((a, b) => a.localeCompare(b));

    if (MEASUREMENTS_KEYS.includes(key)) {
      measurementsFromUrl.set(key, sortedValues);
    } else {
      filtersFromUrl.set(key, sortedValues);
    }
  }

  return {
    filtersFromUrl: filtersFromUrl.size > 0 ? filtersFromUrl : null,
    measurementsFromUrl: measurementsFromUrl.size > 0
      ? measurementsFromUrl
      : null,
  };
}

export function formatRelativeTime(isoDate: string, language: "ES" | "EN") {
  const now = new Date();
  const date = new Date(isoDate);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const timeUnits = language === "ES" ? TIME_UNITS : TIME_UNITS_EN;

  for (const { unit, seconds, plural } of timeUnits) {
    const count = Math.floor(diffInSeconds / seconds);
    if (count >= 1 || unit === "Min.") {
      if ((unit === "Min.") && count < 1) {
        return language === "ES" ? "menos de 1 min." : "less than 1 min.";
      }
      return `${count} ${unit}${count > 1 ? plural : ""}`;
    }
  }
}

export function isValidMeasurements(
  measurements: Partial<Measurements>,
): measurements is Measurements {
  if (
    !measurements.height || !measurements.width ||
    !measurements.depth || !measurements.weight
  ) {
    return false;
  }
  const isValidBaseMeasurement = (
    measurement: Partial<BaseMeasurement>,
  ): boolean => {
    return typeof measurement.unitCode === "string" &&
      typeof measurement.minValue === "number" &&
      typeof measurement.maxValue === "number";
  };

  return isValidBaseMeasurement(measurements.height) &&
    isValidBaseMeasurement(measurements.width) &&
    isValidBaseMeasurement(measurements.depth) &&
    isValidBaseMeasurement(measurements.weight);
}

export function matchAvaliableCategoriesLoaderPattern(
  subjectOf: string,
): {
  categoryId: string;
  categoryName: string;
  categoryLevel: string;
} | null {
  const match = subjectOf.match(AVAILABLE_CATEGORIES_REGEX);
  if (match) {
    return {
      categoryId: match.groups?.categoryId ?? "",
      categoryName: match.groups?.categoryName ?? "",
      categoryLevel: match.groups?.categoryLevel ?? "",
    };
  }
  return null;
}

export function matchAvaliableBrandsLoaderPattern(brand: string) {
  const match = brand.match(AVAILABLE_BRANDS_REGEX);
  if (match) {
    return {
      brandId: match.groups?.brandId ?? "",
      brandName: match.groups?.brandName ?? "",
    };
  }

  return null;
}
