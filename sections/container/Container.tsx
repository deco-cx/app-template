import type { ComponentChildren } from "preact";
import { marginSizes, paddingSizes } from "../../utils/constants.tsx";

export interface SpacingConfig {
  /**
   * @description half-extra-small: 12px extra-small: 24px small: 32px medium: 60px large: 70px extra-large: 80px double-extra-large: 90px triple-extra-large: 104px
   */
  desktop?: SpacingSettings;

  /**
   * @description extra-small: 16px small: 24px medium: 32px large: 35px extra-large: 40px double-extra-large: 45px triple-extra-large: 52px
   */
  mobile?: SpacingSettings;
}

interface SpacingTypeAndSizes {
  /**
   * @description split: the siblings sections will considerate the total spacing between them | join: the siblings section with the biggest spacing will be considerated
   */
  behavior?: "split" | "join";
  size?: SizeOptions;
}

type SpacingSettings = {
  top?: SpacingTypeAndSizes;
  bottom?: SpacingTypeAndSizes;
};

type SizeOptions =
  | "none"
  | "half-extra-small"
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large"
  | "double-extra-large"
  | "triple-extra-large";

interface Props {
  spacing?: SpacingConfig;

  /**
   * @ignore
   */
  class?: string;

  /**
   * @ignore
   */
  children?: ComponentChildren;
  "data-event"?: string;
  "data-event-trigger"?: "click" | "view" | "change";
}

export default function Container(
  { children, spacing, class: _class = "", ...dataEvents }: Props,
) {
  const spacingTopDesktop = spacing?.desktop?.top?.size || "none";
  const spacingBottomDesktop = spacing?.desktop?.bottom?.size || "none";
  const spacingTopMobile = spacing?.mobile?.top?.size || "none";
  const spacingBottomMobile = spacing?.mobile?.bottom?.size || "none";

  return (
    <div
      {...dataEvents}
      id="container"
      class={_class +
        ` ${
          spacing?.desktop?.top?.behavior === "split"
            ? paddingSizes.desktop.top[spacingTopDesktop]
            : marginSizes.desktop.top[spacingTopDesktop]
        } ${
          spacing?.desktop?.bottom?.behavior === "split"
            ? paddingSizes.desktop.bottom[spacingBottomDesktop]
            : marginSizes.desktop.bottom[spacingBottomDesktop]
        } ${
          spacing?.mobile?.top?.behavior === "split"
            ? paddingSizes.mobile.top[spacingTopMobile]
            : marginSizes.mobile.top[spacingTopMobile]
        } ${
          spacing?.mobile?.bottom?.behavior === "split"
            ? paddingSizes.mobile.bottom[spacingBottomMobile]
            : marginSizes.mobile.bottom[spacingBottomMobile]
        }`}
    >
      {children}
    </div>
  );
}
