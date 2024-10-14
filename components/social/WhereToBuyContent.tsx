import { Picture, Source } from "apps/website/components/Picture.tsx";
import {
  BORDER_COLORS,
  GAP_X_SIZES,
  GRID_SIZES_DESKTOP,
  TEXT_COLORS,
} from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import {
  CountryStores,
  StoreCardStyle,
} from "../../sections/Institutional/WhereToBuy.tsx";

export interface Props {
  cardStyle: StoreCardStyle;
  stores?: CountryStores[];
}

export default function WhereToBuyContent({ cardStyle, stores }: Props) {
  if (!stores || stores.length === 0) {
    return <></>;
  }
  const {
    grid,
    gap,
    fontColor,
    titleFontSize,
    descriptionFontSize,
    imagesSizes,
    colorBorder,
  } = cardStyle;

  return (
    <div
      class={clx(
        "mt-10 sm:mt-12 grid grid-cols-1 gap-y-8",
        GRID_SIZES_DESKTOP[grid],
        GAP_X_SIZES[gap],
      )}
    >
      {stores.map((store) => (
        <div
          class={clx(
            "flex flex-col gap-2 sm:gap-4",
            TEXT_COLORS[fontColor],
          )}
        >
          {/* Image */}
          <Picture
            class={clx(
              "h-min rounded",
              BORDER_COLORS[colorBorder],
              store.disableBorder ? "border-none border-0" : "border",
            )}
          >
            <Source
              media="(max-width: 640px)"
              src={store.mobileImage}
              width={imagesSizes.mobile.width ?? 327}
              height={imagesSizes.mobile.height ?? 148}
            />
            <Source
              media="(min-width: 640px)"
              src={store.desktopImage}
              width={imagesSizes.desktop.width ?? 333}
              height={imagesSizes.desktop.height ?? 174}
            />
            <img
              src={store.desktopImage}
              alt={store.title}
              class="w-full object-cover"
            />
          </Picture>
          {/* Text */}
          <div class="flex flex-col">
            <label class={titleFontSize}>{store.title}</label>
            <a
              href={store.href}
              class={clx(
                descriptionFontSize,
                "font-light underline",
              )}
            >
              {store.description}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
