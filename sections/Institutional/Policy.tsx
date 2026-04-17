import { GAP_SIZES, TEXT_COLORS } from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import { FontSize, GapSizes, TextProps } from "../../utils/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";

export interface Props {
  /**
   * @title Title props
   */
  title: TextProps;
  /**
   * @title Content
   * @format rich-text
   */
  content: string;
  /**
   * @title Main fontize of rich text
   */
  contentFontSize?: FontSize;
  /**
   * @title Gap between title and content
   */
  gap?: GapSizes;
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

export default function Policy(
  { title, content, spacing, gap = "0", contentFontSize }: Props,
) {
  return (
    <Container
      spacing={spacing}
      class={clx(
        "flex flex-col",
        GAP_SIZES[gap],
        "px-6 lg:px-0 container",
      )}
    >
      <h1
        class={clx(
          TEXT_COLORS[title.fontColor ?? "primary"],
          title.fontSize,
          title?.fontWeight ?? "font-semibold",
        )}
      >
        {title.text}
      </h1>
      <div
        class={clx(
          "max-w-[863px] text-secondary font-light",
          contentFontSize ?? "text-sm",
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      >
      </div>
    </Container>
  );
}
