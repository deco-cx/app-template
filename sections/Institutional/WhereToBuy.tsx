import { ImageWidget } from "apps/admin/widgets.ts";
import Icon, { AvailableIcons } from "../../components/ui/Icon.tsx";
import {
  HOVER_BG_COLORS,
  HOVER_BORDER_COLORS,
  PEER_CHECKED_BG_COLORS,
  PEER_CHECKED_BORDER_COLORS,
  TEXT_COLORS,
  WHERE_TO_BUY_CONTENT_ID,
} from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import {
  Colors,
  FontSize,
  GapSizes,
  TextProps,
  WidthAndHeight,
} from "../../utils/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import { Props as ContentProps } from "../../components/social/WhereToBuyContent.tsx";
import { useComponent } from "../Component.tsx";

export interface Props {
  /**
   * @title Title props
   */
  title: TextProps;
  /**
   * @title Description props
   */
  description?: TextProps;
  /**
   * @title Cards
   */
  countryCards: CountryCardsProps;
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

interface CountryCardsProps {
  /**
   * @title Global Country card style
   * @description All country cards styling options
   */
  countryCardStyle: CountryCardStyle;
  /**
   * @title Global Store card style
   * @description All store cards styling options
   */
  storeCardStyle: StoreCardStyle;
  /**
   * @title Countries
   */
  countries: CountryCardContent[];
}

interface CountryCardContent {
  /**
   * @title Country name
   */
  label: string;
  /**
   * @title Country flag
   */
  icon: AvailableIcons;
  /**
   * @title Country avaliable stores
   */
  countryStores?: CountryStores[];
}

export interface CountryStores {
  /**
   * @title Desktop store image
   */
  desktopImage: ImageWidget;
  /**
   * @title Mobile store image
   */
  mobileImage: ImageWidget;
  /**
   * @title Title
   */
  title: string;
  /**
   * @title Description
   */
  description: string;
  /**
   * @title Href
   */
  href?: string;
  /**
   * @title Disable Card Border
   */
  disableBorder?: boolean;
}

interface CountryCardStyle {
  /**
   * @title Font color
   */
  fontColor: Colors;
  /**
   * @title Title Font size
   * @description text-xs: 12px, text-sm: 14px, text-base: 16px, text-lg: 18px, text-xl: 20px, text-2xl: 24px, text-3xl: 30px
   */
  fontSize: FontSize;
  /**
   * @title Hover color
   * @description Bg color when hover country card
   */
  hoverColor: Colors;
  /**
   * @title Hover Border color
   * @description Border color when select country card
   */
  hoverColorBorder: Colors;
}

export interface StoreCardStyle {
  /**
   * @title Font color
   */
  fontColor: Colors;
  /**
   * @title Title Font size
   * @description text-xs: 12px, text-sm: 14px, text-base: 16px, text-lg: 18px, text-xl: 20px, text-2xl: 24px, text-3xl: 30px
   */
  titleFontSize: FontSize;
  /**
   * @title Description Font size
   * @description text-xs: 12px, text-sm: 14px, text-base: 16px, text-lg: 18px, text-xl: 20px, text-2xl: 24px, text-3xl: 30px
   */
  descriptionFontSize: FontSize;
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

const Content = import.meta.resolve(
  "../../components/social/WhereToBuyContent.tsx",
);

export default function Support(
  { title, description, spacing, countryCards }: Props,
) {
  const { storeCardStyle, countries, countryCardStyle } = countryCards;
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
          "font-bold",
          title.fontSize,
        )}
      >
        {title.text}
      </h1>
      {/** Description */}
      {description && (
        <div
          class={clx(
            "mt-4 lg:mt-6",
            TEXT_COLORS[description.fontColor ?? "primary"],
            description.fontSize,
          )}
        >
          <span>{description.text}</span>
        </div>
      )}
      {/** Country Cards */}
      <div class="flex flex-row flex-wrap pt-6 gap-4">
        {countries?.map(({ label, icon, countryStores }, index) => {
          const id = `country-${index}`;
          return (
            <div>
              <input
                type="radio"
                class="peer hidden"
                name="country-group"
                id={id}
              />
              <label
                class={clx(
                  "flex flex-col gap-1 border border-neutral px-4 pb-2.5 pt-3.5 font-light rounded-sm cursor-pointer peer-checked:font-normal hover:font-normal peer-checked:pointer-events-none",
                  TEXT_COLORS[countryCardStyle.fontColor],
                  countryCardStyle.fontSize,
                  HOVER_BG_COLORS[countryCardStyle.hoverColor],
                  HOVER_BORDER_COLORS[countryCardStyle.hoverColorBorder],
                  PEER_CHECKED_BG_COLORS[countryCardStyle.hoverColor],
                  PEER_CHECKED_BORDER_COLORS[countryCardStyle.hoverColorBorder],
                )}
                for={id}
                hx-trigger="click"
                hx-target={`#${WHERE_TO_BUY_CONTENT_ID}`}
                hx-swap="innerHTML"
                hx-select="section>*"
                hx-post={useComponent<ContentProps>(Content, {
                  cardStyle: storeCardStyle,
                  stores: countryStores,
                })}
              >
                <Icon id={icon} width={20} height={15} />
                <div class="relative">
                  <span class="invisible font-normal">{label}</span>
                  <span class="absolute left-0 top-0">
                    {label}
                  </span>
                </div>
              </label>
            </div>
          );
        })}
      </div>
      {/** Store Cards */}
      <div id={WHERE_TO_BUY_CONTENT_ID}></div>
    </Container>
  );
}
