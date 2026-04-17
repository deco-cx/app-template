import { ProductDetailsPage } from "apps/commerce/types.ts";
import GallerySlider from "./productGallery/Gallery.tsx";
import { ProductMainProps } from "../../sections/Product/ProductDetails/ProductPage.tsx";
import { clx } from "../../utils/clx.ts";
import {
  LANGUAGE_DIFFS,
  ROUNDED_OPTIONS,
  TEXT_COLORS,
} from "../../utils/constants.tsx";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  productMain: ProductMainProps;
  language: "EN" | "ES";
}

export default function ProductMain({ page, productMain, language }: Props) {
  if (!page) return <></>;
  const { product } = page;
  const { sku, name } = product;
  const { buyButton, productName } = productMain;

  const SkuSpan = () => (
    <span
      className={clx(
        "uppercase",
        TEXT_COLORS[productName?.sku?.fontColor ?? "info"],
        productName?.sku?.fontWeight ?? "font-light",
        productName?.sku?.fontSize ?? "text-sm",
      )}
    >
      {sku}
    </span>
  );

  const TitleSpan = () => (
    <h2
      className={clx(
        TEXT_COLORS[productName?.title?.fontColor ?? "secondary"],
        productName?.title?.fontWeight ?? "font-base",
        productName?.title?.fontSize ?? "text-xl",
      )}
    >
      {name}
    </h2>
  );

  return (
    <div className="container flex flex-col lg:flex-row gap-4 mb-4 px-5 lg:p-0 lg:mb-8">
      {/* Galeria do produto */}
      <div className="w-full lg:w-2/4">
        <GallerySlider
          page={page}
        />
      </div>
      <div
        className="flex flex-col gap-2  w-full lg:w-2/4 mt-6 lg:mt-12 lg:ml-6"
        data-gtm-block-name="pdp-top"
      >
        {productName?.position === "1"
          ? (
            <>
              <TitleSpan />
              <SkuSpan />
            </>
          )
          : (
            <>
              <SkuSpan />
              <TitleSpan />
            </>
          )}
        {!buyButton.isDisabled && (
          <a
            className={clx(
              "flex justify-center items-center",
              "w-full lg:max-w-80 h-[42px] bg-primary",
              "text-white text-sm font-semibold mt-4",
              ROUNDED_OPTIONS[buyButton.rounded],
            )}
            href={buyButton.redirectTo}
            data-gtm-element="pdp-cta-link"
            data-gtm-value={LANGUAGE_DIFFS[language].productPage.buttonText}
          >
            {LANGUAGE_DIFFS[language].productPage.buttonText}
          </a>
        )}
      </div>
    </div>
  );
}
