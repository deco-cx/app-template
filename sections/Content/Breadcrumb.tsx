import Icon from "../../components/ui/Icon.tsx";
import { AvailableIcons } from "../../components/ui/Icon.tsx";
import {
  BORDER_COLORS,
  GAP_SIZES,
  TEXT_COLORS,
} from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import { Colors, FontSize, FontWeight } from "../../utils/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import { GapSizes } from "../../utils/types.ts";

export interface Props {
  /**
   * @title Icon
   * @format icon-select
   * @options site/loaders/availableIcons.ts
   */
  icon?: AvailableIcons;
  /**
   * @title Icon size
   */
  iconSize?: number;
  /**
   * @title Font color
   */
  fontColor: Colors;
  /**
   * @title Font size
   */
  fontSize: FontSize;
  /**
   * @title Font weight
   */
  fontWeight?: FontWeight;
  /**
   * @title Items
   */
  items: Items[];
  /**
   * @title GAP between items
   */
  gap?: GapSizes;
  disableContainer?: boolean;
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

/**
 * @titleBy label
 */
export interface Items {
  /**
   * @title Label
   */
  label: string;
  /**
   * @title Href
   */
  href?: string;
  /**
   * @title Override font color
   */
  overrideFontColor?: Colors;
  /**
   * @title Underline on hover
   */
  hoverUnderline?: boolean;
  /**
   * @title Override font weight
   */
  overrideFontWeight?: FontWeight;
}

export default function Breadcrumb(
  {
    icon,
    fontColor,
    fontSize,
    spacing,
    iconSize = 16,
    items,
    fontWeight,
    gap,
    disableContainer,
  }: Props,
) {
  return (
    <Container
      spacing={spacing}
      class={clx("px-6 lg:px-0", !disableContainer && "container")}
    >
      <div
        class={clx(
          "flex flex-row",
          TEXT_COLORS[fontColor ?? "primary"],
          fontWeight ?? "font-medium",
          fontSize,
          GAP_SIZES[gap ?? "2"],
          "max-w-[calc(100vw-32px)]",
        )}
      >
        {icon && (
          <>
            <a href="/" class="self-center">
              <Icon
                id={icon}
                size={iconSize}
                width={iconSize}
                height={iconSize}
              />
            </a>
            <Icon
              id="chevron-frigidaire"
              size={16}
              width={16}
              height={16}
              class="text-accent min-w-4 self-center"
            />
          </>
        )}
        {items.map((
          {
            label,
            href,
            overrideFontColor,
            hoverUnderline,
            overrideFontWeight,
          },
          i,
        ) => (
          <>
            <a
              href={href}
              class={clx(
                "last:line-clamp-1 content-center [&:not(:last-child)]:inline-block [&:not(:last-child)]:whitespace-nowrap",
                overrideFontColor && TEXT_COLORS[overrideFontColor],
                overrideFontWeight,
              )}
            >
              <span
                class={clx(
                  hoverUnderline && "border-b-2 line-clamp-1",
                  BORDER_COLORS[overrideFontColor ?? fontColor],
                )}
              >
                {label}
              </span>
            </a>
            {i < items.length - 1 && (
              <Icon
                id="chevron-frigidaire"
                size={16}
                width={16}
                height={16}
                class="text-accent min-w-4 self-center"
              />
            )}
          </>
        ))}
      </div>
    </Container>
  );
}
