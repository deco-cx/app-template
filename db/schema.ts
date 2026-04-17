import {
  AnySQLiteColumn,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const contact = sqliteTable("contact", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  country: text("country"),
  serialNumber: text("serialNumber"),
  subject: text("subject"),
  message: text("message"),
  personName: text("personName"),
  personSurname: text("personSurname"),
  personEmail: text("personEmail"),
  personPhone: text("personPhone"),
  date: text("date"),
  status: text("status"),
  originSite: text("originSite"),
});

//Define the avaliable domains to the product and his categories
export const domains = sqliteTable("domains", {
  identifier: text("identifier").primaryKey(), // P.K
  description: text("name").notNull(),
});

//Define the categories
export const categories = sqliteTable("categories", {
  identifier: text("identifier").primaryKey(),
  name: text("name").notNull(),
  alternateName: text("alternateName"),
  description: text("description"),
  alternateDescription: text("alternateDescription"),
  additionalType: text("additionalType").notNull(),
  subjectOf: text("subjectOf").references((): AnySQLiteColumn =>
    categories.identifier
  ),
  image: text("image"),
  thumbnail: text("thumbnail"),
});

//Define categories of a product
export const productCategories = sqliteTable("productCategories", {
  identifier: integer("identifier").primaryKey({ autoIncrement: true }), // P.K
  subjectOf: text("subjectOf").references(() => categories.identifier), // F.K
  product: text("product").references(() => products.sku), // F.K
});

//Define products
export const products = sqliteTable("products", {
  sku: text("sku").primaryKey(), // P.K
  name: text("name").notNull(),
  alternateName: text("alternateName"),
  productID: text("productID").notNull().unique(),
  url: text("url").notNull().unique(),
  brand: text("brand").references(() => brands.identifier), // F.K
  description: text("description"),
  alternateDescription: text("alternateDescription"),
  gtin: text("gtin"),
});

//Define brands
export const brands = sqliteTable("brands", {
  identifier: text("identifier").primaryKey(), // P.K
  name: text("name").notNull(),
  description: text("description"),
  logo: text("logo"),
});

//Define product measurements
export const productMeasurements = sqliteTable("productMeasurements", {
  identifier: integer("identifier").primaryKey({ autoIncrement: true }), // P.K
  subjectOf: text("subjectOf").references(() => products.sku), // F.K
  propertyID: text("propertyID").notNull(), // Width, Height, Depth, Weight, etc.
  unitCode: text("unitCode").notNull(), // cm, mm, kg, etc.
  maxValue: real("maxValue").notNull(), // With box
  minValue: real("minValue").notNull(), // Without box
});

//Define filters groups
export const filtersGroups = sqliteTable("filtersGroups", {
  identifier: text("identifier").primaryKey(), // P.K
  name: text("name").notNull(), // In Spanish
  alternateName: text("alternateName"), // In English
});

//Define product additionalProperties
export const additionalProperties = sqliteTable("additionalProperties", {
  identifier: integer("identifier").primaryKey({ autoIncrement: true }), // P.K
  subjectOf: text("subjectOf").references(() => products.sku), // F.K
  additionalType: text("additionalType").references(() =>
    filtersGroups.identifier
  ), // F.K
  name: text("name").notNull(), // In Spanish
  alternateName: text("alternateName"), // In English
  value: text("value").notNull(), // In Spanish
  alternateValue: text("alternateValue"), // In English
  unitText: text("unitText"), // In Spanish
  alternateUnitText: text("alternateUnitText"), // In English
});

//Define product extra descriptions
export const descriptions = sqliteTable("descriptions", {
  identifier: integer("identifier").primaryKey({ autoIncrement: true }), // P.K
  subjectOf: text("subjectOf").references(() => products.sku), // F.K
  name: text("name").notNull(),
  alternateName: text("alternateName"),
  value: text("value").notNull(),
  alternateValue: text("alternateValue"),
  image: text("image"),
});

//Define product images
export const images = sqliteTable("images", {
  identifier: integer("identifier").primaryKey({ autoIncrement: true }), // P.K
  subjectOf: text("subjectOf").references(() => products.sku), // F.K
  url: text("url").notNull(),
  disambiguatingDescription: text("disambiguatingDescription"),
});

//Define product videos
export const videos = sqliteTable("videos", {
  identifier: integer("identifier").primaryKey({ autoIncrement: true }), // P.K
  subjectOf: text("subjectOf").references(() => products.sku), // F.K
  contentUrl: text("contentUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl").notNull(),
});

//Define product avaliability
export const avaliableIn = sqliteTable("avaliableIn", {
  identifier: integer("identifier").primaryKey({ autoIncrement: true }), // P.K
  subjectOf: text("subjectOf").references(() => products.sku), // F.K
  domain: text("domain").references(() => domains.identifier), // F.K
});

//Define product documents
export const productDocuments = sqliteTable("productDocuments", {
  identifier: integer("identifier").primaryKey({ autoIncrement: true }), // P.K
  subjectOf: text("subjectOf").references(() => products.sku), // F.K
  url: text("url").notNull(),
  name: text("name").notNull(),
  alternateName: text("alternateName"),
  language: text("language").notNull(),
});
