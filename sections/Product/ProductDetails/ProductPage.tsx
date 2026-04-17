import { ProductDetailsPage } from "apps/commerce/types.ts";
import ProductMain from "../../../components/product/ProductMain.tsx";
import ProductDetails from "../../../components/product/ProductDetails.tsx";
import Container, { SpacingConfig } from "../../container/Container.tsx";
import {
  Colors,
  FontSize,
  RoundedOptions,
  TextProps,
} from "../../../utils/types.ts";
import { AppContext } from "../../../mod.ts";
import { LANGUAGE_DIFFS } from "../../../utils/constants.tsx";
import SEO, {
  Props as SEOProps,
} from "apps/commerce/sections/Seo/SeoPDPV2.tsx";

interface ProductPageProps {
  /** @description product loader of the page */
  page: ProductDetailsPage | null;
  /** @description Product main colors */
  productMain: ProductMainProps;
  /** @description SEO props */
  seo: Omit<SEOProps, "jsonLD">;
  /** @description Spacing config */
  spacing?: SpacingConfig;
}

export interface ProductMainProps {
  /** @description Product name section */
  productName?: ProductNameProps;
  /** @description Buy button */
  buyButton: BuyButtonProps;
  /**
   * @title Product extra data
   * @description Product description data
   */
  tabs?: TabProps;
  /** @description Background color */
  bgColor?: Colors;
  /** @title Quantity of no image descriptions */
  /** @description Merge description with no image in mobile */
  mergeQuantity?: number;
}

interface BuyButtonProps {
  /** @description Is button disabled */
  isDisabled: boolean;
  /** @description Redirect to */
  redirectTo: string;
  /** @description Rounded */
  rounded: RoundedOptions;
}

interface ProductNameProps {
  /** @title Product name props */
  title?: Omit<TextProps, "text">;
  /** @title SKU props */
  sku?: Omit<TextProps, "text">;
  /** @description Position of SKU/Name */
  position?: "1" | "2";
}

interface TabProps {
  /** @description Styling of the titles of each section */
  titles?: Omit<TextProps, "text">;
  /** @description Styling of the enabled tab */
  enabledTab?: Omit<TextProps, "text"> & { underlineColor?: Colors };
  /** @description Styling of the disabled tab */
  disabledTab?: Omit<TextProps, "text"> & { underlineColor?: Colors };
  /** @title Styling of the description grid */
  productDescription?: ProductDescriptionProps;
  /** @title Styling of the tech sheet table */
  techSheet?: TechSheetProps[];
}

export interface ProductDescriptionProps {
  /** @description Styling of the title of each grid */
  title?: Omit<TextProps, "text">;
  /** @description Size of the descriptions */
  descriptionSize?: FontSize;
}

export interface TechSheetProps {
  /** @description Background color */
  bgColor: Colors;
  /** @description Description color and weight */
  descriptionProps: Omit<TextProps, "text" | "fontSize">;
  /** @description Value color and weight */
  valueProps: Omit<TextProps, "text" | "fontSize">;
}

export const loader = (
  props: ProductPageProps,
  _req: Request,
  ctx: AppContext,
) => {
  return {
    language: ctx.language,
    siteTemplate: ctx.siteTemplate,
    ...props,
  };
};

export default function ProductPage(
  {
    page,
    spacing,
    language,
    productMain,
  }: ReturnType<
    typeof loader
  >,
) {
  if (!page) return <NotFound language={language} />;
  const { product } = page;
  const { additionalProperty, description } = product;
  const { seo } = page;
  return (
    <>
      <SEO {...seo} jsonLD={page} />
      <Container class="flex flex-col" spacing={spacing}>
        <ProductMain
          page={page}
          productMain={productMain}
          language={language}
        />
        <ProductDetails
          additionalProperty={additionalProperty}
          description={description}
          language={language}
          productMain={productMain}
        />
      </Container>
    </>
  );
}

function NotFound({ language }: { language: "EN" | "ES" }) {
  return (
    <div class="w-full flex flex-col justify-center items-center py-10 text-primary font-bold text-2xl h-[50vh]">
      <span>{LANGUAGE_DIFFS[language].listingPage.notFound}</span>
      <a
        href="javascript:history.back()"
        class="mt-4 text-base underline cursor-pointer hover:opacity-75"
      >
        {LANGUAGE_DIFFS[language].listingPage.goBack || "Go back"}
      </a>
    </div>
  );
}

export const LoadingFallback = () => {
  return (
    <div class="w-full flex flex-col justify-center items-center h-[100vh]">
      <span class="loading loading-spinner text-primary loading-lg" />
    </div>
  );
};
