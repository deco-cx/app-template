import Icon, { AvailableIcons } from "../../components/ui/Icon.tsx";
import {
  GAP_X_SIZES,
  GRID_COL_SPAN_DESKTOP,
  GRID_SIZES_DESKTOP,
  TEXT_COLORS,
} from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import { Colors, FontSize, GapSizes, TextProps } from "../../utils/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";

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
  cards: CardContent[];
  /**
   * @title Cards styling
   */
  cardsStyling: CardsStyling;
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

/**
 * @titleBy title
 */
interface CardContent {
  /**
   * @title Title
   */
  title: string;
  /**
   * @title Info items
   */
  cardItems: CardItem[];
}

/**
 * @titleBy label
 */
interface CardItem {
  /**
   * @title Icon
   * @format icon-select
   * @options site/loaders/availableIcons.ts
   */
  icon: AvailableIcons;
  /**
   * @title Label
   */
  label: string;
  /**
   * @title Href
   */
  href?: string;
}

interface CardsStyling {
  /**
   * @title Icons Style
   */
  icons: CardsIconProps;
  /**
   * @title Texts style
   */
  text: CardsTextProps;
  /**
   * @title Cards grid (only desktop)
   */
  grid: "1" | "2" | "3" | "4";
  /**
   * @title Cards gap
   */
  gap: GapSizes;
}

interface CardsIconProps {
  /**
   * @title Icons size (px)
   */
  iconSize: number;
  /**
   * @title Icons color
   */
  iconColor: Colors;
}
interface CardsTextProps {
  /**
   * @title Title Font color
   */
  titleFontColor?: Colors;
  /**
   * @title Info font color
   */
  fontColor: Colors;
  /**
   * @title Font size
   * @description text-xs: 12px, text-sm: 14px, text-base: 16px, text-lg: 18px, text-xl: 20px, text-2xl: 24px, text-3xl: 30px
   */
  fontSize: FontSize;
}

export default function Support(
  { title, description, cards, cardsStyling, spacing }: Props,
) {
  const { grid, text, icons, gap } = cardsStyling;
  const columns = Number(grid);
  return (
    <Container
      spacing={spacing}
      class={clx(
        "px-6 lg:px-0 container",
      )}
    >
      <h1
        class={clx(
          TEXT_COLORS[title.fontColor ?? "primary"],
          title.fontSize,
          title.fontWeight ?? "font-semibold",
        )}
      >
        {title.text}
      </h1>
      {description && (
        <div
          class={clx(
            "mt-4 lg:mt-6 ",
            TEXT_COLORS[description.fontColor ?? "primary"],
            description.fontSize,
            description?.fontWeight ?? "font-light",
          )}
        >
          <span>{description.text}</span>
        </div>
      )}
      <div
        class={clx(
          "mt-12 grid grid-cols-1",
          GRID_SIZES_DESKTOP[grid],
          GAP_X_SIZES[gap],
        )}
      >
        {cards.map(({ cardItems, title }, index) => (
          <>
            <div
              class={clx(
                "flex flex-col gap-4 pb-6 md:pb-10",
                text.fontSize,
                index >= columns ? "md:pt-8" : "",
                "max-md:border-b max-md:border-base-200 max-md:pt-6",
                "max-md:last:border-b-0 max-md:first:pt-0",
              )}
            >
              <span
                class={clx(
                  "text-base font-semibold",
                  TEXT_COLORS[text.titleFontColor ?? text.fontColor],
                )}
              >
                {title}
              </span>
              <div
                class={clx("flex flex-col gap-3", TEXT_COLORS[text.fontColor])}
              >
                {cardItems.map(({ href, icon, label }) => (
                  <div class="flex flex-row gap-3 sm:gap-4 items-center font-light">
                    <div class="w-max">
                      <Icon
                        id={icon}
                        width={icons.iconSize}
                        height={icons.iconSize}
                        size={icons.iconSize}
                        class={TEXT_COLORS[icons.iconColor]}
                      />
                    </div>
                    <a href={href}>{label}</a>
                  </div>
                ))}
              </div>
              <div class="flex-grow" />
            </div>
            {index % columns === columns - 1 &&
              index !== cards.length - 1 && (
              <div
                class={clx(
                  "hidden md:block md:h-px md:bg-base-200",
                  GRID_COL_SPAN_DESKTOP[grid],
                )}
              />
            )}
          </>
        ))}
      </div>
    </Container>
  );
}
