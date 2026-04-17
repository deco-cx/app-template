import { Product } from "apps/commerce/types.ts";
import { TextProps } from "../../utils/types.ts";
import Slider from "../ui/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { type Resolved } from "@deco/deco";
import { clx } from "../../utils/clx.ts";
import { AppContext } from "../../mod.ts";

export interface Props {
  skuStyle: Omit<TextProps, "text">;
  nameStyle: Omit<TextProps, "text">;
  products?: Product[] | null;
  loader?: Resolved<Product[] | null>;
  dotsColor: string;
  borderColor: string;
  divId: string;
  overrideGTM?: string;
}

export const action = async (
  props: Props,
  _request: Request,
  ctx: AppContext,
) => {
  const { products, loader, ...rest } = props;
  if (products) {
    return { ...rest, products };
  }

  const { __resolveType, ...loaderProps } = loader!;

  // @ts-expect-error This is a dynamic resolved loader
  const productsFromLoader = await ctx.invoke(__resolveType, loaderProps) as
    | Product[]
    | null;
  return { ...rest, products: productsFromLoader };
};

export default function ProductSlider(
  { skuStyle, nameStyle, products, dotsColor, borderColor, divId, overrideGTM }:
    Props,
) {
  return (
    <>
      <span class="loading loading-spinner text-primary loading-lg hidden [.htmx-request_&]:block mx-auto lg:mt-[180px] lg:mb-[156px] mt-[168px] mb-0" />
      <div class="flex flex-col [.htmx-request_&]:hidden">
        <Slider class="carousel carousel-center w-full gap-2 sm:gap-4 px-1.5 max-lg:px-6">
          {products?.map((p, index) => (
            <Slider.Item
              index={index}
              class="w-[245px] min-w-[245px] pt-4 pb-4 h-[376px] min-h-[376px]"
            >
              <div
                data-gtm-block-name={overrideGTM ?? "carrossel-produtos"}
                class="h-full"
              >
                <ProductCard
                  product={p}
                  skuStyle={skuStyle}
                  nameStyle={nameStyle}
                  index={index}
                />
              </div>
            </Slider.Item>
          ))}
        </Slider>
      </div>
      <div class="flex justify-center max-md:hidden h-6">
        <ul
          class={clx(
            "carousel carousel-center justify-center gap-3 px-5",
            "rounded-full w-min",
            "border-[1px]",
            borderColor,
            "flex bg-white",
          )}
          data-dots
        >
          {products?.map((_, index) => (
            <li className="carousel-item w-3 h-full flex justify-center items-center has-[.hidden]:hidden group">
              <Slider.Dot
                index={index}
                className={clx(
                  "disabled:bg-primary disabled:border-primary w-2.5 h-2.5 rounded-full border border-white hidden",
                  dotsColor,
                )}
              >
              </Slider.Dot>
            </li>
          ))}
        </ul>
      </div>

      <Slider.JS rootId={divId} infinite={true} />
    </>
  );
}
