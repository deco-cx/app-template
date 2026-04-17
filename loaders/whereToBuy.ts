import { ImageWidget } from "apps/admin/widgets.ts";
import { AvailableIcons } from "../components/ui/Icon.tsx";
import { AppContext } from "../mod.ts";

export interface Props {
  /**
   * @title Countries
   */
  countries: CountryCardContent[];
}

/**
 * @titleBy label
 */
export interface CountryCardContent {
  /**
   * @title Country name
   */
  label: string;
  /**
   * @title Country id
   */
  id: string;
  /**
   * @title Icon
   * @format icon-select
   * @options site/loaders/availableIcons.ts
   */
  icon?: AvailableIcons;
  /**
   * @title Country avaliable stores
   */
  countryStores?: CountryStores[];
}

export interface Image{
  /**
   * @title Image
   */
  image: ImageWidget;

  /**
   * @title width
   * @description width of the image edit the size of the image for ajustement of the image
   * @default 400
   */
  width?: number;

  /**
   * @title height
   * @description height of the image edit the size of the image for ajustement of the image
   * @default 174
   */
  height?: number;

  /**
   * @title disable border
   * @description disable border of the image
   */
  disableBorder?: boolean;
}

export interface CountryStores {
  desktopImage: Image;
  mobileImage: Image;
  /**
   * @title alt
   * @description alt of the image
   */
  alt: string;

  /**
   * @title title
   * @description title of the image
   */
  title: string;
  /**
   * @title description
   * @description description of the image
   */
  description: string;
  /**
   * @title href
   * @description href of the image
   */
  href?: string;
  
}

/**
 * @title Where to buy
 * @description Save an get the where to buy data.
 *
 * @param props - The props for the where to buy.
 * @param req - The request object.
 * @param ctx - The application context.
 * @returns A promise that resolves to a where to buy.
 */
export default function loader(
  { countries }: Props,
  _req: Request,
  _ctx: AppContext,
): CountryCardContent[] | undefined {
  if (!countries || countries.length === 0) {
    return undefined;
  }
  return countries;
}
