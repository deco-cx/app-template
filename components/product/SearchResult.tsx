import {
  FilterToggle,
  ListItem,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { useId } from "../../sdk/useId.ts";
import { useDevice, useSection } from "@deco/deco/hooks";
import { clx } from "../../utils/clx.ts";
import Sort from "./Sort.tsx";
import Filters from "./Filters.tsx";
import { ListingMainProps } from "../../sections/Product/ProductListing/ProductListingPage.tsx";
import {
  BG_COLORS,
  BORDER_CLASSES,
  BORDER_COLORS,
  HOVER_BG_COLORS_WITH_BORDER,
  LANGUAGE_DIFFS,
  ROUNDED_OPTIONS,
  TEXT_COLORS,
} from "../../utils/constants.tsx";
import ProductCard from "./ProductCard.tsx";
import { ButtonProps, RoundedOptions } from "../../utils/types.ts";
import { MenuMobile } from "./MenuMobile.tsx";

export interface Props {
  page: ProductListingPage;
  listingMain?: ListingMainProps;
  mainBreadcrumbItem?: ListItem<string>;
  /**
   * @ignore
   */
  partial?: "hideMore" | "hideLess";
  url: string;
  language: "EN" | "ES";
  siteTemplate: "elux" | "frigidaire";
}

export interface Layout {
  /**
   * @title Show more button props
   */
  buttonProps?: ButtonProps & {
    /** @description Rounded */
    rounded: RoundedOptions;
  };
}

const useUrlRebased = (
  overrides: string | undefined,
  base: string,
  returnOnlyProducts: boolean,
) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    if (returnOnlyProducts) {
      final.searchParams.set("onlyProducts", "true");
    }
    url = final.href;
  }
  return url;
};

export default function SearchResult(
  { page, ...props }: Props,
) {
  const container = useId();
  const device = useDevice();
  const { listingMain, url, partial, mainBreadcrumbItem } = props;
  const { filters, sortOptions } = page;

  const sortBy = sortOptions.length > 0 && (
    <Sort
      sortOptions={sortOptions}
      url={url}
      siteTemplate={props.siteTemplate}
    />
  );

  const titleSpan = (
    <span class="text-sm font-semibold flex lg:text-xl">
      {mainBreadcrumbItem?.item}
    </span>
  );

  return (
    <>
      <div id={container} class="w-full">
        {
          /** If its partial, return only the results
           * If its not partial, return the filters and the results
           */
        }
        {partial
          ? <Result {...props} page={page} />
          : (
            <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-5 sm:px-0">
              <div class="grid grid-cols-1 sm:grid-cols-[245px_1fr] sm:gap-5 group">
                {/** Return the filters aside in desktop and the filters drawer in mobile */}
                {device === "desktop"
                  ? (
                    <aside
                      class={clx(
                        "place-self-start flex flex-col gap-4 p-4 w-full",
                        TEXT_COLORS[
                          listingMain?.filtersFontColor ??
                            "primary"
                        ],
                      )}
                      style={{
                        boxShadow: props.siteTemplate === "frigidaire"
                          ? "0px 2px 4px 0px #56697326"
                          : "",
                      }}
                    >
                      {titleSpan}
                      <span class="text-base font-semibold flex">
                        {LANGUAGE_DIFFS[props.language].listingPage.filters}
                      </span>
                      <hr class="border-t border-base-200" />
                      <Filters
                        filters={filters}
                        siteTemplate={props.siteTemplate}
                      />
                    </aside>
                  )
                  : (
                    <>
                      <div
                        class={clx(
                          "pb-4 flex flex-col w-full gap-4",
                          TEXT_COLORS[
                            listingMain?.filtersFontColor ??
                              "primary"
                          ],
                        )}
                      >
                        <div
                          class={clx(
                            "flex",
                            props.siteTemplate === "frigidaire"
                              ? "flex-row gap-2 items-center"
                              : "flex-col",
                          )}
                        >
                          {titleSpan}
                          <span class="text-xxs font-light text-secondary">
                            ({page.pageInfo.records}{" "}
                            {LANGUAGE_DIFFS[props.language].listingPage
                              .productCount})
                          </span>
                        </div>
                        <div class="flex flex-row gap-2 w-full">
                          {/** Sort and Filter buttons */}
                          <div class="w-full">
                            {/** Filter button */}
                            <label
                              for="open-filters"
                              class={clx(
                                "select w-full rounded border-xs border-warning text-warning-content",
                                "focus:border-warning items-center",
                                props.siteTemplate === "elux"
                                  ? "text-base font-medium"
                                  : "text-sm font-light pt-1",
                              )}
                              style={{
                                backgroundImage:
                                  `url('${props.listingMain?.filterIconUrl}')`,
                                backgroundSize: "16px",
                                backgroundPosition:
                                  "calc(100% - 14px) calc(50%), calc(100%) calc(50%)",
                                outline: "none !important",
                              }}
                            >
                              {LANGUAGE_DIFFS[props.language].listingPage
                                .filter}
                            </label>
                          </div>
                          <div class="w-full">
                            {/** Sort button */}
                            {sortBy}
                          </div>
                        </div>
                      </div>
                      <MenuMobile
                        filters={filters as FilterToggle[]}
                        language={props.language}
                        siteTemplate={props.siteTemplate}
                      />
                      <input
                        id="open-filters"
                        type="checkbox"
                        class="hidden peer"
                      />
                      <style
                        dangerouslySetInnerHTML={{
                          __html: `
            html:has(#open-filters:checked) {
              overflow-y: hidden;
            }
          `,
                        }}
                      />
                    </>
                  )}
                {/** Return the results */}
                <div class="flex flex-col gap-4 w-full">
                  {/** Desktop: return products quantity and sort options */}
                  {device === "desktop" && (
                    <div
                      class={clx(
                        "flex justify-between items-center",
                        TEXT_COLORS[
                          listingMain
                            ?.filtersFontColor ??
                            "primary"
                        ],
                      )}
                    >
                      <span class="text-xxs font-light">
                        {page.pageInfo.records}{" "}
                        {LANGUAGE_DIFFS[props.language].listingPage
                          .productCount}
                      </span>
                      <div class="w-[156px]">
                        {sortBy}
                      </div>
                    </div>
                  )}
                  {/** Actually return the results */}
                  <Result {...props} page={page} />
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
}

function Result(props: Props) {
  const { listingMain, url, partial } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url, true);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url, true);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });
  const buttonProps = listingMain?.layout?.buttonProps;
  const buttonClass = clx(
    TEXT_COLORS[buttonProps?.fontColor ?? "white"],
    BG_COLORS[buttonProps?.color ?? "primary"],
    buttonProps?.borderColor ? BORDER_COLORS[buttonProps.borderColor] : "",
    buttonProps?.borderWidth && buttonProps.borderWidth !== "0"
      ? BORDER_CLASSES.full[buttonProps.borderWidth]
      : "",
    buttonProps?.hoverColor
      ? HOVER_BG_COLORS_WITH_BORDER[buttonProps.hoverColor]
      : "",
    ROUNDED_OPTIONS[buttonProps?.rounded ?? "none"],
  );

  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center">
      <div
        class={clx(
          "pb-2 sm:pb-5",
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <a
          rel="prev"
          class={clx(
            "btn btn-ghost px-4 min-h-10 max-h-10 md:mt-6",
            "font-semibold",
            buttonClass,
          )}
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">
            {LANGUAGE_DIFFS[props.language].listingPage.showLess}
          </span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-1 gap-2",
          "sm:grid-cols-3 sm:gap-5",
          "w-full",
        )}
      >
        {products?.map((_product, _index) => (
          <ProductCard
            product={_product}
            skuStyle={listingMain!.cardStyling!.skuStyle}
            nameStyle={listingMain!.cardStyling!.nameStyle}
            shouldHideGTM={true}
            index={_index}
          />
        ))}
      </div>
      <div
        class={clx(
          "pt-2 sm:pt-5 w-full",
          (!nextPageUrl || partial === "hideMore") &&
            "hidden",
        )}
      >
        <div class="flex justify-center [&_section]:contents">
          <a
            rel="next"
            class={clx(
              "btn btn-ghost px-4 min-h-10 max-h-10 md:mt-6",
              "font-semibold",
              buttonClass,
            )}
            hx-swap="outerHTML show:parent:top"
            hx-get={partialNext}
          >
            <span class="inline [.htmx-request_&]:hidden">
              {LANGUAGE_DIFFS[props.language].listingPage.showMore}
            </span>
            <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
          </a>
        </div>
      </div>
    </div>
  );
}
