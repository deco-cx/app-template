import { Product } from "apps/commerce/types.ts";
import { asResolved, type Resolved } from "@deco/deco";
import Container, { SpacingConfig } from "../../container/Container.tsx";
import { AppContext } from "../../../mod.ts";
import { clx } from "../../../utils/clx.ts";
import { useId } from "../../../sdk/useId.ts";
import Slider from "../../../components/ui/Slider.tsx";
import Icon from "../../../components/ui/Icon.tsx";
import { CardStyling } from "../../../components/product/ProductCard.tsx";
import ProductSlider, {
  Props as ProductSliderProps,
} from "../../../components/product/ProductSlider.tsx";
import { useComponent } from "../../Component.tsx";
import { useScript } from "@deco/deco/hooks";

const ProductSliderShelf = import.meta.resolve(
  "../../../components/product/ProductSlider.tsx",
);

export interface Props {
  /**
   * @title Title
   * @description Title of the product shelf
   */
  title: string;
  /**
   * @title Extra link
   * @description Extra link of the product shelf
   */
  extraLink?: ExtraLink;
  /**
   * @title Products
   * @description Use a tabbedShelf to have multiple groups of products and a productShelf to have a single group of products
   */
  products: TabbedShelf[] | ProductShelf;
  spacingConfig?: SpacingConfig;
}

interface ExtraLink {
  /**
   * @title Text
   * @description Text of the extra link
   */
  text?: string;
  /**
   * @title Href
   * @description Href of the extra link
   */
  href?: string;
}

interface ProductShelf {
  /**
   * @title Data
   * @description Products of the shelf
   */
  loader: Product[] | null;
}

/**
 * @titleBy title
 */
interface TabbedShelf {
  /**
   * @title Tab title
   * @description Title of the tab
   */
  title: string;
  /**
   * @title Data
   * @description Products of the tab
   */
  loader: Resolved<Product[] | null>;
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  const url = new URL(req.url);
  return {
    ...props,
    siteTemplate: ctx.siteTemplate,
    url: url,
  };
};

function goToItem(rootId: string, index: number) {
  const root = document.getElementById(rootId);
  const item = root?.querySelector<HTMLLabelElement>(
    `[data-tab-index="${index}"]`,
  );
  const slider = root?.querySelector<HTMLDivElement>(`[data-tab-slider]`);
  if (item && slider) {
    slider.scrollTo({
      left: item.offsetLeft - slider.offsetLeft,
    });
  }
}

export default function ProductShelf(
  { title, extraLink, products, spacingConfig, siteTemplate }: ReturnType<
    typeof loader
  >,
) {
  const id = useId();
  const isProductShelf = checkIsProductShelf(products);
  const {
    skuStyle,
    nameStyle,
    extraLinkFontStyle,
    titleFontStyle,
    borderColor,
    dotsColor,
    tabStyle,
  } = siteTemplate === "frigidaire" ? FRIGIDAIRE_STYLE : ELUX_STYLE;
  return (
    <Container spacing={spacingConfig} class="container">
      {/* Main div */}
      <div id={id} class="flex flex-col gap-6">
        {/* Title, extra link and slider buttons */}
        <div class="flex flex-row justify-between">
          {/* Title and extra link */}
          <div class="flex lg:flex-row lg:gap-6 flex-col gap-2 max-lg:px-6">
            <h2 class={titleFontStyle}>{title}</h2>
            {extraLink && (
              <a
                href={extraLink.href}
                class={clx(extraLinkFontStyle, "underline-offset-[3px]")}
              >
                {extraLink.text}
              </a>
            )}
          </div>
          {/* Slider buttons */}
          <div class="hidden md:flex flex-row gap-2">
            <Slider.PrevButton
              class={clx(
                "hidden md:flex disabled:invisible btn-circle !h-10 !w-10 !min-h-10 !min-w-10 no-animation justify-center items-center",
                "bg-white shadow-[0px_2px_4px_0px_#56697326]",
              )}
              disabled={false}
            >
              <Icon
                width={24}
                height={24}
                id="chevron-right"
                class="rotate-180 text-primary"
              />
            </Slider.PrevButton>
            <Slider.NextButton
              class={clx(
                "hidden md:flex disabled:invisible btn-circle !h-10 !w-10 !min-h-10 !min-w-10 no-animation justify-center items-center",
                "bg-white shadow-[0px_2px_4px_0px_#56697326]",
              )}
              disabled={false}
            >
              <Icon
                id="chevron-right"
                class="text-primary"
                width={24}
                height={24}
              />
            </Slider.NextButton>
          </div>
        </div>
        {/* Slider */}
        {isProductShelf
          ? (
            <ProductSlider
              skuStyle={skuStyle}
              nameStyle={nameStyle}
              products={products.loader}
              dotsColor={dotsColor}
              borderColor={borderColor}
              divId={id}
            />
          )
          : (
            <TabbedShelf
              products={products}
              divId={id}
              skuStyle={skuStyle}
              nameStyle={nameStyle}
              dotsColor={dotsColor}
              borderColor={borderColor}
              tabStyle={tabStyle}
              rootId={id}
            />
          )}
      </div>
    </Container>
  );
}

const checkIsProductShelf = (products: TabbedShelf[] | ProductShelf) =>
  "loader" in products;

const TabbedShelf = (
  {
    products,
    divId,
    skuStyle,
    nameStyle,
    dotsColor,
    borderColor,
    tabStyle,
    rootId,
  }:
    & {
      products: TabbedShelf[];
    }
    & Omit<ProductSliderProps, "products" | "loader">
    & {
      tabStyle: string;
      rootId: string;
    },
) => {
  const slotId = useId();
  return (
    <div class="flex flex-col">
      <div
        class="carousel flex gap-1"
        role="tablist"
        data-tab-slider
      >
        {products.map(({ title, loader }, index) => (
          <label
            key={index}
            class={clx(
              "carousel-item cursor-pointer",
              "has-[:checked]:cursor-default has-[:checked]:pointer-events-none",
              index === 0 && "max-lg:pl-6",
              index === products.length - 1 && "max-lg:pr-6",
            )}
            data-tab-index={index}
          >
            <div data-gtm-block-name="carrossel-categorias">
              <input
                type="radio"
                name={`product-tabs-${slotId}`}
                defaultChecked={index === 0}
                value={index}
                class="peer hidden"
                hx-trigger="change"
                hx-target={`#${slotId}`}
                hx-swap="innerHTML"
                hx-select="section>*"
                hx-post={loader &&
                  (useComponent<ProductSliderProps>(
                    ProductSliderShelf,
                    {
                      skuStyle: skuStyle,
                      nameStyle: nameStyle,
                      loader: asResolved(loader),
                      dotsColor: dotsColor,
                      borderColor: borderColor,
                      divId,
                      overrideGTM: "carrossel-categorias",
                    },
                  ))}
                hx-on:click={useScript(goToItem, rootId, index)}
                hx-indicator={`#${slotId}`}
              />
              <span
                class={clx(
                  "block px-6 py-2 border-b-2 transition-colors whitespace-nowrap",
                  tabStyle,
                )}
                data-gtm-element="category-tab"
                data-gtm-value={title}
              >
                {title}
              </span>
            </div>
          </label>
        ))}
      </div>
      <div
        id={slotId}
        class="min-h-[376px] lg:min-h-[400px]"
        hx-post={products[0].loader &&
          (useComponent<ProductSliderProps>(ProductSliderShelf, {
            skuStyle: skuStyle,
            nameStyle: nameStyle,
            loader: asResolved(products[0].loader),
            dotsColor: dotsColor,
            borderColor: borderColor,
            divId,
            overrideGTM: "carrossel-categorias",
          }))}
        hx-trigger="load"
        hx-select="section>*"
      >
        <span class="loading loading-spinner text-primary loading-lg hidden [.htmx-request_&]:block mx-auto lg:mt-[180px] mt-[168px]" />
      </div>
    </div>
  );
};

const FRIGIDAIRE_STYLE = {
  titleFontStyle: "text-xl text-secondary content-center",
  extraLinkFontStyle: "text-info text-xs font-light underline content-center",
  skuStyle: {
    fontColor: "warning-content",
    fontSize: "text-xxs",
    fontWeight: "font-light",
  } as CardStyling["skuStyle"],
  nameStyle: {
    fontColor: "secondary",
    fontSize: "text-sm",
    fontWeight: "font-medium",
  } as CardStyling["nameStyle"],
  borderColor: "border-base-300",
  dotsColor: "bg-base-200",
  tabStyle: clx(
    "peer-checked:border-b-primary peer-checked:text-secondary peer-checked:font-medium",
    "border-b-transparent text-info font-light",
    "hover:border-b-primary hover:text-secondary hover:font-medium",
  ),
};

const ELUX_STYLE = {
  titleFontStyle: "text-xl text-primary content-center font-medium",
  extraLinkFontStyle:
    "text-warning-content text-xs font-light underline content-center",
  skuStyle: {
    fontColor: "success-content",
    fontSize: "text-sm",
    fontWeight: "font-normal",
  } as CardStyling["skuStyle"],
  nameStyle: {
    fontColor: "primary",
    fontSize: "text-base",
    fontWeight: "font-medium",
  } as CardStyling["nameStyle"],
  borderColor: "border-[#DEE7EA]",
  dotsColor: "bg-base-200",
  tabStyle: clx(
    "peer-checked:border-b-primary peer-checked:text-primary peer-checked:font-medium",
    "border-b-transparent text-[#ADB4BD] font-light",
    "hover:border-b-primary hover:text-primary hover:font-medium",
  ),
};

export const LoadingFallback = (
  { spacingConfig, products, extraLink }: Partial<Props>,
) => {
  const hasProducts = products && !("loader" in products);
  return (
    <Container spacing={spacingConfig} class="container">
      <div class="flex flex-row justify-between">
        <div class="flex lg:flex-row lg:gap-6 flex-col gap-2 max-lg:px-6 lg:items-center">
          <div className="skeleton h-6 w-52"></div>
          {extraLink?.text && <div className="skeleton h-4 w-28"></div>}
        </div>
        <div class="flex flex-row gap-2">
          <div className="skeleton hidden md:flex disabled:invisible btn-circle !h-10 !w-10 !min-h-10 !min-w-10 rounded-full">
          </div>
          <div className="skeleton hidden md:flex disabled:invisible btn-circle !h-10 !w-10 !min-h-10 !min-w-10 rounded-full">
          </div>
        </div>
      </div>
      {hasProducts && (
        <div class="flex flex-row gap-6 mt-10 lg:mt-7 overflow-hidden max-lg:pl-6">
          {products.map((_) => (
            <div class="h-[24px] w-28 min-w-28 skeleton"></div>
          ))}
        </div>
      )}
      <div
        class={clx(
          "flex flex-row min-h-[376px] lg:min-h-[400px] lg:justify-center",
          "bg-white mt-3 gap-2 sm:gap-4 overflow-hidden max-lg:pl-6",
          !hasProducts && "mb-3",
        )}
      >
        <div className="flex w-[245px] min-w-[245px] pt-7 flex-col gap-4">
          <div className="skeleton h-56 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="flex w-[245px] min-w-[245px] pt-7 flex-col gap-4">
          <div className="skeleton h-56 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="flex w-[245px] min-w-[245px] pt-7 flex-col gap-4">
          <div className="skeleton h-56 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="flex w-[245px] min-w-[245px] pt-7 flex-col gap-4">
          <div className="skeleton h-56 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    </Container>
  );
};
