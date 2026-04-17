import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "search"
  | "Pinterest"
  | "Twitter"
  | "YouTube"
  | "Instagram"
  | "Facebook"
  | "shopping_bag"
  | "menu"
  | "account_circle"
  | "close"
  | "chevron-right"
  | "favorite"
  | "home_pin"
  | "call"
  | "local_shipping"
  | "pan_zoom"
  | "share"
  | "sell"
  | "check-circle"
  | "error"
  | "trash"
  | "home-frigidaire"
  | "chevron-frigidaire"
  | "email-frigidaire"
  | "headset-frigidaire"
  | "error-frigidaire"
  | "close-frigidaire"
  | "freezer-frigidaire"
  | "cocina-frigidaire"
  | "washer-frigidaire"
  | "iron-frigidaire"
  | "dryer-frigidaire"
  | "conditioning-frigidaire"
  | "vacuum-frigidaire"
  | "refrigerator-frigidaire"
  | "wind-frigidaire"
  | "usa-frigidaire"
  | "spain-frigidaire"
  | "costa-rica-frigidaire"
  | "dominican-frigidaire"
  | "el-salvador-frigidaire"
  | "guatemala-frigidaire"
  | "honduras-frigidaire"
  | "nicaragua-frigidaire"
  | "panama-frigidaire"
  | "bag-frigidaire"
  | "tool-frigidaire"
  | "book-frigidaire"
  | "heart-frigidaire"
  | "dots-frigidaire"
  | "height-property"
  | "width-property"
  | "depth-property"
  | "weight-property"
  | "water-purifier"
  | "air-fryer-frigidaire"
  | "pan-frigidaire"
  | "chevron-down-frigidaire"
  | "refrigerator-frigidaire-alt"
  | "cross-frigidaire"
  | "microwave-elux"
  | "empotrable-elux";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon id="search" />
   */
  id: AvailableIcons;
  size?: number;
}

function Icon(
  { id, size = 24, width, height, ...otherProps }: Props,
) {
  return (
    <svg
      {...otherProps}
      width={width ?? size}
      height={height ?? size}
    >
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
