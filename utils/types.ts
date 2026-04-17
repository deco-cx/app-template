import { ImageWidget } from "apps/admin/widgets.ts";
import { AvailableIcons } from "../components/ui/Icon.tsx";

export type Colors =
  | "base-100"
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "base-200"
  | "base-300"
  | "base-400"
  | "base-content"
  | "primary-content"
  | "secondary-content"
  | "accent-content"
  | "neutral-content"
  | "success-content"
  | "warning-content"
  | "error-content"
  | "info-content"
  | "black"
  | "white"
  | "transparent";

export type FontStyle = "font-noto-sans";

export type FontWeight =
  | "font-thin"
  | "font-extralight"
  | "font-light"
  | "font-normal"
  | "font-medium"
  | "font-semibold"
  | "font-bold"
  | "font-extrabold"
  | "font-black";

export type FontSize =
  | "text-xxs"
  | "text-xs"
  | "text-sm"
  | "text-base"
  | "text-lg"
  | "text-xl"
  | "text-2xl"
  | "text-2.5xl"
  | "text-3xl"
  | "text-3.5xl"
  | "text-4xl";

export type GapSizes =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "10"
  | "12"
  | "16"
  | "20"
  | "24"
  | "28";

export interface TextProps {
  /**
   * @title Text
   */
  text: string;
  /**
   * @title Font color
   */
  fontColor: Colors;
  /**
   * @title Font size
   * @description text-xs: 12px, text-sm: 14px, text-base: 16px, text-lg: 18px, text-xl: 20px, text-2xl: 24px, text-2.5xl: 28px, text-3xl: 30px, text-3.5xl: 34px, text-4xl: 36px,
   */
  fontSize: FontSize;
  /**
   * @title Font weight
   */
  fontWeight?: FontWeight;
}

export interface ButtonProps {
  /**
   * @title Text
   */
  text: string;
  /**
   * @title Background color
   */
  color: Colors;
  /**
   * @title Background color hover
   */
  hoverColor?: Colors;
  /**
   * @title Border color
   */
  borderColor?: Colors;
  /**
   * @title Border width
   */
  borderWidth?: "0" | "1" | "2";
  /**
   * @title Font color
   */
  fontColor: Colors;
}

export type RoundedOptions =
  | "none"
  | "sm"
  | "regular"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export interface WidthAndHeight {
  width?: number;
  height?: number;
}

export interface Success {
  success: boolean;
  message?: string;
}

export interface SubmitContactFormProps {
  country?: string;
  serialNumber?: string;
  subject?: string;
  message?: string;
  personName?: string;
  personSurname?: string;
  personEmail?: string;
  personPhone?: string;
  status?: string;
}

export interface Image {
  desktop: ImageProps;
  mobile: ImageProps;
  /**
   * @title Alt
   */
  alt: string;
}

export interface ImageProps {
  /**
   * @title Image
   */
  src: ImageWidget;
  /**
   * @title Size
   */
  sizing: WidthAndHeight;
}

export interface IconProps {
  /**
   * @title Icon
   * @format icon-select
   * @options site/loaders/availableIcons.ts
   */
  icon?: AvailableIcons;
  color?: Colors;
  size?: number;
}

export interface Category {
  /**
   * @title Category identifier
   * @description e.g SLUG. The unique category ID
   */
  identifier: string;
  /**
   * @title Spanish Name
   * @description Category name
   */
  name: string;
  /**
   * @title English Name
   * @description Category name in english
   */
  alternateName?: string;
  /**
   * @title Spanish Category description
   * @description Category description
   */
  description?: string;
  /**
   * @title English Category description
   * @description Category description in english
   */
  alternateDescription?: string;
  /**
   * @title Category father
   * @description Select an category to be superior to this category.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableCategories.ts
   */
  subjectOf?: string;
  /**
   * @title Category Banner
   * @description Banner displayed in the category page.
   * @format image-uri
   */
  image?: string;
  /**
   * @title Category Icon
   * @description Used in Guides and manuals page.
   * @format icon-select
   * @options site/loaders/availableIcons.ts
   */
  thumbnail?: AvailableIcons;
}

export interface ProductCategory {
  /**
   * @title Category ID
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableCategories.ts
   */
  subjectOf: string;
}

export interface Product {
  sku: string;
  /**
   * @title Spanish name
   */
  name: string;
  /**
   * @title English name
   */
  alternateName?: string;
  /**
   * @title Model code
   */
  productID: string;
  /**
   * @title Slug
   */
  url: string;
  /**
   * @title Brand
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableBrands.ts
   */
  brand: string;
  /**
   * @title Description
   * @format rich-text
   */
  description?: string;
  /**
   * @title English description
   * @format rich-text
   */
  alternateDescription?: string;
  gtin?: string;
}

export interface Brand {
  /**
   * @title Brand Id
   */
  identifier: string;
  name: string;
  description?: string;
  /**
   * @format image-uri
   */
  logo?: string;
}

export interface FiltersGroups {
  /**
   * @title Filter Slug
   * @description The unique filter group ID and his slug.
   */
  identifier: string;
  /**
   * @title Spanish name
   */
  name: string;
  /**
   * @title English name
   */
  alternateName: string;
}

export interface ProductMeasurements {
  /**
   * @title Property Identificator
   */
  propertyID:
    | "HEIGHT"
    | "WIDTH"
    | "DEPTH"
    | "WEIGHT";
  /**
   * @title Unit Code
   * @description cm, mm, kg, etc.
   */
  unitCode: string;
  /**
   * @title Value without box
   */
  minValue: number;
  /**
   * @title Value with box
   */
  maxValue: number;
}

export type BaseMeasurement = Omit<ProductMeasurements, "propertyID">;

export interface Measurements {
  /**
   * @title Height
   */
  height: BaseMeasurement;
  /**
   * @title Width
   */
  width: BaseMeasurement;
  /**
   * @title Depth
   */
  depth: BaseMeasurement;
  /**
   * @title Weight
   */
  weight: BaseMeasurement;
}

export interface AdditionalProperty {
  /**
   * @title Filter Group
   * @description To use this property as a filter, you need to select a filter group.
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableFiltersGroups.ts
   */
  additionalType?: string;
  /**
   * @title Spanish Property Title
   */
  name: string;
  /**
   * @title English Property Title
   */
  alternateName: string;
  /**
   * @title Spanish Property Value
   */
  value: string;
  /**
   * @title English Property Value
   * @description If applicable
   */
  alternateValue?: string;
  /**
   * @title Spanish Unit Text
   */
  unitText?: string;
  /**
   * @title English Unit Text
   * @description If applicable
   */
  alternateUnitText?: string;
}

export interface Description {
  /**
   * @title Spanish description title
   */
  name: string;
  /**
   * @title English description title
   */
  alternateName?: string;
  /**
   * @title Spanish description body
   * @format rich-text
   */
  value: string;
  /**
   * @title English description body
   * @format rich-text
   */
  alternateValue?: string;
  /**
   * @title Description image
   * @format image-uri
   */
  image?: string;
}

export interface ImageProduct {
  /**
   * @title Image
   * @format image-uri
   */
  url: string;
  /**
   * @title Alternate Text
   */
  disambiguatingDescription?: string;
}

export interface Video {
  /**
   * @title Video URL
   * @description Paste the FULL video URL from YouTube
   */
  contentUrl: string;
  /**
   * @title Thumbnail
   * @format image-uri
   */
  thumbnailUrl: string;
}

export interface AvaliableIn {
  /**
   * @title Site
   * @format dynamic-options
   * @options elux-components-app/loaders/product/avaliableSites.ts
   */
  domain: string;
}

export interface ProductDocument {
  /**
   * @title Document
   * @format file-uri
   */
  url: string;
  /**
   * @title Spanish name
   */
  name: string;
  /**
   * @title English name
   */
  alternateName?: string;
  /**
   * @title Language
   */
  language: "ES" | "EN" | "both";
}
