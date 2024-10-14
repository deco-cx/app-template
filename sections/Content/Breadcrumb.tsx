import Icon from "../../components/ui/Icon.tsx";
import { AvailableIcons } from "../../components/ui/Icon.tsx";
import { TEXT_COLORS } from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import { Colors, FontSize } from "../../utils/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";

export interface Props {
  /**
   * @title Icon
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
   * @title Items
   */
  items: Items[];
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

interface Items {
  /**
   * @title Label
   */
  label: string;
  /**
   * @title Href
   */
  href?: string;
}

export default function Breadcrumb(
  { icon, fontColor, fontSize, spacing, iconSize = 16, items }: Props,
) {
  return (
    <Container spacing={spacing} class="container px-4 lg:px-0">
      <div
        class={clx(
          "flex flex-row gap-2 font-medium",
          TEXT_COLORS[fontColor ?? "primary"],
          fontSize,
        )}
      >
        {icon && (
          <>
            <a href="/">
              <Icon
                id={icon}
                size={iconSize}
                width={iconSize}
                height={iconSize}
              />
            </a>
            <Icon
              id="chevron-frigidaire"
              size={iconSize}
              width={iconSize}
              height={iconSize}
              class="text-accent"
            />
          </>
        )}
        {items.map(({ label, href }) => (
          <a href={href}>
            {label}
          </a>
        ))}
      </div>
    </Container>
  );
}
