import Icon from "../../components/ui/Icon.tsx";
import {
  BG_COLORS,
  BORDER_COLORS,
  FOCUS_TEXT_COLORS,
  ROUNDED_OPTIONS,
  TEXT_COLORS,
} from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import {
  Colors,
  FontSize,
  FontWeight,
  GapSizes,
  RoundedOptions,
  WidthAndHeight,
} from "../../utils/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import { AppContext } from "../../mod.ts";
import stylingDiff from "../../utils/styling/institucional/WhereToBuy/stylingDiff.ts";
import { useDevice } from "@deco/deco/hooks";
import { CountryCardContent } from "../../loaders/whereToBuy.ts";
import Content from "../../components/social/WhereToBuyContent.tsx";
import { HOVER_BG_COLORS } from "../../utils/constants.tsx";
import { HOVER_TEXT_COLORS } from "../../utils/constants.tsx";

export function loader(props: Props, req: Request, ctx: AppContext) {
  const url = new URL(req.url);
  const countryId = url.searchParams.get("country") ?? props.forceCountry;
  const countryContent = countryId
    ? props?.countries?.find(({ id }) => id === countryId)
    : undefined;
  return {
    ...props,
    countryContent,
    siteTemplate: ctx.siteTemplate,
    countryName: countryContent?.label,
    url,
  };
}

export interface Props {
  /**
   * @title Title props
   */
  titleText: string;
  /**
   * @title Description props
   */
  descriptionText?: string;
  /**
   * @title Empty content text
   * @description Text to show when there are no country or city selected
   */
  emptyContent: string;
  /**
   * @title Force country
   * @description If a country is selected, it will be shown even if there are no stores in that country
   */
  forceCountry?: string;
  /**
   * @title Hide country selector
   */
  hideCountrySelector?: boolean;
  /**
   * @title Cards
   */
  countries: CountryCardContent[] | undefined;
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

export interface CountrySelectStyle {
  borderColor: Colors;
  rounded: RoundedOptions;
  selectColor: Colors;
  optionsColor: Colors;
  hoverColor: Colors;
  hoverFontColor: Colors;
}

export interface StoreCardStyle {
  /**
   * @title Title Font size
   * @description text-xs: 12px, text-sm: 14px, text-base: 16px, text-lg: 18px, text-xl: 20px, text-2xl: 24px, text-3xl: 30px
   */
  titleFontSize: FontSize;
  /**
   * @title Title Font color
   */
  fontColor: Colors;
  /**
   * @title Title Font Weight
   */
  fontWeight?: FontWeight;
  /**
   * @title Description Font size
   * @description text-xs: 12px, text-sm: 14px, text-base: 16px, text-lg: 18px, text-xl: 20px, text-2xl: 24px, text-3xl: 30px
   */
  descriptionFontSize: FontSize;
  /**
   * @title Description font color
   */
  descriptionFontColor?: Colors;

  /**
   * @title Images Sizes
   */
  imagesSizes: ImageSizes;
  /**
   * @title Cards grid (only desktop)
   */
  grid: "1" | "2" | "3" | "4";
  /**
   * @title Cards gap
   */
  gap: GapSizes;
  /**
   * @title Border color
   */
  colorBorder: Colors;
}

interface ImageSizes {
  mobile: WidthAndHeight;
  desktop: WidthAndHeight;
}

export default function Support(
  {
    titleText,
    descriptionText,
    spacing,
    countries,
    siteTemplate,
    countryContent,
    url,
    emptyContent,
    countryName,
    hideCountrySelector = false,
  }: ReturnType<
    typeof loader
  >,
) {
  const styling = stylingDiff[siteTemplate];
  const device = useDevice() === "desktop" ? "desktop" : "mobile";
  const { title, description, countrySelectStyle } = styling[device];
  return (
    <Container
      spacing={spacing}
      class={clx(
        "px-6 lg:px-0 container",
      )}
    >
      {/** Title */}
      <h1
        class={clx(
          TEXT_COLORS[title.fontColor ?? "primary"],
          title.fontWeight ?? "font-semibold",
          title.fontSize,
        )}
      >
        {titleText}
      </h1>
      {/** Description */}
      {descriptionText && (
        <div
          class={clx(
            "mt-4 lg:mt-6",
            TEXT_COLORS[description.fontColor ?? "primary"],
            description.fontSize,
            description.fontWeight ?? "font-light",
          )}
        >
          <span>{descriptionText}</span>
        </div>
      )}
      {/** Country Cards */}
      {!hideCountrySelector && (
        <div class="flex flex-row flex-wrap pt-6 gap-4">
          <div
            name="country"
            class="dropdown"
          >
            <div
              tabIndex={0}
              role="button"
              class={clx(
                "w-[327px] h-12 border-xs text-base font-normal px-4 items-center flex flex-row justify-between group bg-white",
                ROUNDED_OPTIONS[countrySelectStyle.rounded],
                TEXT_COLORS[countrySelectStyle.optionsColor],
                BORDER_COLORS[countrySelectStyle.borderColor],
                siteTemplate === "elux" &&
                  "focus:!border-b-transparent focus:rounded-b-none",
                FOCUS_TEXT_COLORS[countrySelectStyle.selectColor],
              )}
            >
              <span class="flex flex-row gap-2.5 items-center">
                {countryContent
                  ? (
                    <>
                      {countryContent.icon && (
                        <Icon id={countryContent.icon} width={20} height={15} />
                      )}
                      {countryContent.label}
                    </>
                  )
                  : emptyContent}
              </span>
              <Icon
                id="chevron-right"
                width={24}
                height={24}
                class="text-primary rotate-90 group-focus:-rotate-90 duration-150 ease-in-out"
              />
            </div>

            <ul
              tabIndex={0}
              class={clx(
                "dropdown-content menu bg-white z-[1] w-[327px] shadow text-base !px-0 !py-1",
                BORDER_COLORS[countrySelectStyle.borderColor],
                TEXT_COLORS[countrySelectStyle.optionsColor],
                siteTemplate === "frigidaire"
                  ? "!rounded mt-1 border-xs"
                  : "border-x border-b !rounded-b-[1px]",
              )}
              style={{
                boxShadow: "0px 8px 16px 0px #56697326",
              }}
            >
              {countries?.map(({ label, icon, id }) => {
                const href = new URL(url);
                href.searchParams.set("country", id);
                return (
                  <div
                    data-gtm-block-name="where-to-buy"
                    class="h-[38px] items-center w-full cursor-pointer"
                  >
                    <a
                      class={clx(
                        "w-full h-full flex flex-row gap-2.5 px-4 rounded-none items-center",
                        HOVER_TEXT_COLORS[countrySelectStyle.hoverFontColor],
                        HOVER_BG_COLORS[countrySelectStyle.hoverColor],
                        countryContent?.id === id && clx(
                          TEXT_COLORS[countrySelectStyle.hoverFontColor],
                          BG_COLORS[countrySelectStyle.hoverColor],
                        ),
                      )}
                      data-gtm-element="country-selector-link"
                      data-gtm-value={label}
                      href={href.href}
                    >
                      <span class="p-0">
                        {icon && <Icon id={icon} width={20} height={15} />}
                      </span>
                      <span class="p-0 hover:!bg-transparent">{label}</span>
                    </a>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      {/** Store Cards */}
      <Content
        siteTemplate={siteTemplate}
        device={device}
        stores={countryContent?.countryStores}
        countryName={countryName ?? ""}
      />
    </Container>
  );
}
