import Container, { SpacingConfig } from "../container/Container.tsx";
import { GapSizes, TextProps } from "../../utils/types.ts";
import { clx } from "../../utils/clx.ts";
import {
  GAP_X_SIZES,
  GAP_Y_SIZES,
  GRID_SIZES_DESKTOP,
  TEXT_COLORS,
} from "../../utils/constants.tsx";

export interface Props {
  /**
   * @title Title
   */
  title?: TextProps;
  /**
   * @title Description
   */
  description?: TextProps;
  /**
   * @title Sections Props
   * @description Define global props to the text sections
   */
  sectionProps: SectionProps;
  /**
   * @title Text sections
   */
  textSections: TextSection[];
  /**
   * @title Spacing config
   */
  spacingConfig?: SpacingConfig;
}

/**
 * @titleBy title
 */
interface TextSection {
  /**
   * @title Title
   */
  title: string;
  /**
   * @title Complement
   * @format rich-text
   */
  complement: string;
}

interface SectionProps {
  /**
   * @title Text Sections Props - Title
   */
  titleProps: Omit<TextProps, "text">;
  /**
   * @title Text Sections Props - Complement
   */
  complementProps: Omit<TextProps, "text">;
  /**
   * @title Text Sections Props - Horizontal Gap
   */
  gapX: GapSizes;
  /**
   * @title Text Sections Props - Vertical Gap
   */
  gapY: GapSizes;
  /**
   * @title Text Sections Props - Grid size in mobile
   */
  grid: "1" | "2" | "3" | "4";
}

export default function TextCards(
  { title, description, sectionProps, textSections, spacingConfig }: Props,
) {
  const { gapY, gapX, grid, titleProps, complementProps } = sectionProps;
  return (
    <Container spacing={spacingConfig} class="container max-sm:px-6">
      {title && (
        <p
          class={clx(
            title.fontSize,
            title.fontWeight,
            TEXT_COLORS[title.fontColor],
            "mb-4",
          )}
        >
          {title.text}
        </p>
      )}
      {description && (
        <p
          class={clx(
            description.fontSize,
            description.fontWeight,
            TEXT_COLORS[description.fontColor],
            "mb-10",
          )}
        >
          {description.text}
        </p>
      )}
      <div
        class={clx(
          "grid grid-cols-1",
          GRID_SIZES_DESKTOP[grid],
          GAP_X_SIZES[gapX],
          GAP_Y_SIZES[gapY],
        )}
      >
        {textSections.map(({ title, complement }) => (
          <div class="flex flex-col gap-4">
            <p
              class={clx(
                titleProps.fontWeight,
                titleProps.fontSize,
                TEXT_COLORS[titleProps.fontColor],
              )}
            >
              {title}
            </p>
            <div
              class={clx(
                complementProps.fontWeight,
                complementProps.fontSize,
                TEXT_COLORS[complementProps.fontColor],
              )}
              dangerouslySetInnerHTML={{ __html: complement }}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
