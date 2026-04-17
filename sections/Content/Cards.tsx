import Container, { SpacingConfig } from "../container/Container.tsx";
import { clx } from "../../utils/clx.ts";
import {
  BG_COLORS,
  GAP_SIZES,
  GRID_SIZES_DESKTOP,
  TEXT_COLORS,
} from "../../utils/constants.tsx";
import { Colors, GapSizes, TextProps } from "../../utils/types.ts";

export interface Props {
  /** @title Background color  */
  backgroundColor: Colors;
  /** @title Title  */
  title: TextProps;
  /** @title Description  */
  description: TextProps;
  /** @title Cards config  */
  cardConfig: CardConfig;
  /** @title Cards content  */
  cards?: Card[];
  /** @title Spacing config  */
  spacing?: SpacingConfig;
}

interface CardConfig {
  /** @title Card text styling  */
  textStyling: Omit<TextProps, "text">;
  /** @title Card Background color  */
  bgColor: Colors;
  /** @title Gap between cards  */
  gap: GapSizes;
  /** @title Grid config  */
  grid: "1" | "2" | "3" | "4";
}

/**
 * @titleBy text
 */
interface Card {
  /**
   * @title Text
   */
  text: string;
  /**
   * @title Link
   */
  href?: string;
}

export default function Cards(
  { backgroundColor, title, description, cardConfig, cards, spacing }: Props,
) {
  return (
    <Container
      spacing={spacing}
      class={clx(
        BG_COLORS[backgroundColor],
      )}
    >
      <div class="container max-sm:px-6 flex flex-col items-center gap-8 sm:gap-10">
        <div class="max-w-[686px] flex flex-col gap-4">
          <p
            class={clx(
              title.fontSize,
              title.fontWeight,
              TEXT_COLORS[title.fontColor],
              "text-center",
            )}
          >
            {title.text}
          </p>
          <div class="max-w-[510px] sm:text-center text-justify">
            <p
              class={clx(
                description.fontSize,
                description.fontWeight,
                TEXT_COLORS[description.fontColor],
              )}
            >
              {description.text}
            </p>
          </div>
        </div>
        <div
          class={clx(
            "grid grid-cols-1",
            GRID_SIZES_DESKTOP[cardConfig.grid],
            GAP_SIZES[cardConfig.gap],
            cardConfig.textStyling.fontSize,
            cardConfig.textStyling.fontWeight,
            TEXT_COLORS[cardConfig.textStyling.fontColor],
          )}
        >
          {cards?.map((c) => (
            <a
              href={c.href}
              class={clx(
                BG_COLORS[cardConfig.bgColor],
                "p-6 text-center rounded-lg",
              )}
            >
              {c.text}
            </a>
          ))}
        </div>
      </div>
    </Container>
  );
}
