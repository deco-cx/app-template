import type { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";
import { clx } from "../../utils/clx.ts";
import Video from "apps/website/components/Video.tsx";
import { AppContext } from "../../mod.ts";

/**
 * @titleBy alt
 */
export interface Banner {
  /** @description desktop otimized image */
  desktop: BannerItem;
  /** @description mobile otimized image */
  mobile: BannerItem;
  /** @description Image's alt text */
  alt: string;
  /**
    @title Banner content
    */
  bannerType?: "image" | "video";
  action?: {
    /** @description when user clicks on the image, go to this link */
    href: string;
  };
}
export interface BannerItem {
  /** @title Image*/
  image?: ImageWidget;
  /** @description if you are using GIFs, prefer using videos */
  /** @title Video*/
  video?: VideoWidget;
  /** @title Width*/
  width?: number;
  /** @title Height*/
  height?: number;
}
export interface Props {
  images?: Banner[];
  /**
   * @description Use this options if the banner is the biggest banner of the screen
   */
  preload?: boolean;
  /**
   * @title Autoplay interval
   * @description Time (in seconds) to start the autoplay of the carousel
   */
  interval?: number;
  fullWidth?: boolean;
}

const FRIGIDAIRE_STYLE = {
  borderColor: "border-base-300",
  dotsColor: "bg-base-200",
  prevNextStyle: "bg-white",
  iconColor: "text-primary",
  buttonShadow: "shadow-[0px_2px_4px_0px_#56697326]",
  bgColor: "bg-base-300",
};

const ELUX_STYLE = {
  borderColor: "border-[#DEE7EA]",
  dotsColor: "bg-[#DEE7EA]",
  prevNextStyle: "bg-black bg-opacity-20",
  iconColor: "text-white",
  buttonShadow: "",
  bgColor: "bg-[#DEE7EA]",
};

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return {
    ...props,
    siteTemplate: ctx.siteTemplate,
  };
}

function BannerItem({ image, lcp, isDesktop }: {
  image: Banner;
  lcp?: boolean;
  isDesktop: boolean;
}) {
  const { alt, mobile, desktop, action } = image;

  const [video, width, height] = isDesktop
    ? [desktop.video, desktop.width ?? 1646, desktop.height ?? 429]
    : [mobile.video, mobile.width ?? 375, mobile.height ?? 375];
  return (
    <a
      href={action?.href ?? "#"}
      class="relative block overflow-y-hidden w-full"
    >
      {image.bannerType === "video"
        ? (
          <Video
            src={video || ""}
            autoplay
            width={width}
            height={height}
            loop
            muted
            class="w-full border-none"
          />
        )
        : (
          <Picture preload={lcp}>
            <Source
              media="(max-width: 767px)"
              fetchPriority={lcp ? "high" : "auto"}
              src={mobile.image!}
              width={mobile.width ?? 375}
              height={mobile.height ?? 375}
            />
            <Source
              media="(min-width: 768px)"
              fetchPriority={lcp ? "high" : "auto"}
              src={desktop.image!}
              width={desktop.width ?? 1646}
              height={desktop.height ?? 429}
            />
            <img
              class="object-cover w-full h-full"
              loading={lcp ? "eager" : "lazy"}
              src={desktop.image}
              alt={alt}
            />
          </Picture>
        )}
    </a>
  );
}
function Carousel(
  { images = [], preload, interval, siteTemplate, fullWidth }: ReturnType<
    typeof loader
  >,
) {
  const { borderColor, dotsColor, prevNextStyle, iconColor, buttonShadow } =
    siteTemplate === "frigidaire" ? FRIGIDAIRE_STYLE : ELUX_STYLE;

  const id = useId();
  const device = useDevice();
  return (
    <div
      id={id}
      class={clx(
        "grid w-ful",
        "grid-rows-[1fr_40px_1fr_20px]",
        "grid-cols-[32px_1fr_32px]",
        "sm:grid-cols-[160px_1fr_160px] min-h-min",
        !fullWidth && "max-w-[1280px] mx-auto",
        siteTemplate === "frigidaire"
          ? FRIGIDAIRE_STYLE.bgColor
          : ELUX_STYLE.bgColor,
      )}
    >
      <div class="col-span-full row-span-full">
        <Slider class="carousel carousel-center w-full gap-6">
          {images.map((image, index) => (
            <Slider.Item index={index} class="carousel-item w-full">
              <BannerItem
                image={image}
                lcp={index === 0 && preload}
                isDesktop={device === "desktop"}
              />
            </Slider.Item>
          ))}
        </Slider>
      </div>

      {images.length > 1 && (
        <>
          <div class="hidden sm:flex items-end justify-end z-10 col-start-1 row-start-2">
            <Slider.PrevButton
              class={clx(
                "hidden sm:flex disabled:invisible btn-circle !h-10 !w-10 !min-h-10 !min-w-10 no-animation justify-center items-center",
                prevNextStyle,
                buttonShadow,
              )}
              disabled={false}
            >
              <Icon
                width={24}
                height={24}
                id="chevron-right"
                class={clx(
                  "rotate-180",
                  iconColor,
                )}
              />
            </Slider.PrevButton>
          </div>

          <div class="hidden sm:flex items-end justify-start z-10 col-start-3 row-start-2">
            <Slider.NextButton
              class={clx(
                "hidden sm:flex disabled:invisible btn-circle !h-10 !w-10 !min-h-10 !min-w-10 no-animation justify-center items-center",
                prevNextStyle,
                buttonShadow,
              )}
              disabled={false}
            >
              <Icon
                id="chevron-right"
                class={iconColor}
                width={24}
                height={24}
              />
            </Slider.NextButton>
          </div>
        </>
      )}

      {images.length > 1 && (
        <div
          class={clx(
            "col-span-full row-start-4 z-10",
            "carousel justify-center h-6",
          )}
        >
          <ul
            class={clx(
              "carousel carousel-center justify-center gap-3 px-5 h-6",
              "rounded-full",
              "border-[1px]",
              borderColor,
              "flex bg-white",
            )}
          >
            {images.map((_, index) => (
              <li
                key={index}
                className="carousel-item w-3 h-full flex justify-center items-center"
              >
                <Slider.Dot
                  index={index}
                  className={clx(
                    "disabled:bg-primary disabled:border-primary flex w-2.5 h-2.5 rounded-full border border-white",
                    dotsColor,
                  )}
                >
                </Slider.Dot>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}

export default Carousel;
