import { ImageWidget } from "apps/admin/widgets.ts";
import { AppContext } from "../mod.ts";
import { AvailableIcons } from "../components/ui/Icon.tsx";
import { Colors, FontSize, FontWeight } from "../utils/types.ts";

/** @titleBy title */
export interface NavItem {
  /**
   * @title Icon
   */
  icon?: AvailableIcons;
  /** @title Title */
  title: string;
  /** @title Open in new tab */
  isBlank?: boolean;
  link: string;
}

/** @titleBy title */
export interface Category {
  /**
   * @title Icon
   */
  icon?: AvailableIcons;
  /** @title Title */
  title: string;
  link: string;
  /** @title Open in new tab */
  isBlank?: boolean;
  /** @title Nav items */
  navItems: NavItem[];
  titleColor?: Colors;
}

/**
 * @titleBy title
 * @title {{#categories}}{{{title}}} {{/categories}}
 */
export interface Column {
  /** @title Categories */
  categories: Category[];
}

/** @titleBy title */
export interface Department {
  /**
   * @title Ícone
   */
  icon?: AvailableIcons;
  /** @title Title */
  title: string;
  /**
   * @title Title color
   */
  color?: Colors;
  link: string;
  /** @title Open in new tab */
  isBlank?: boolean;
  /** @title Columns */
  collums: Column[];
}

/** @titleBy title */
export interface ExtraLink {
  /**
   * @title Ícone
   */
  icon?: AvailableIcons;
  /** @title Title */
  title: string;
  link: string;
  /** @title Is a new tab? */
  isBlank?: boolean;
  /** @description Color of the menu text */
  textColor?: Colors;
  /** @description Color of the menu icon */
  textSize?: FontSize;
  /** @description Font weight text */
  fontWeight?: FontWeight;
}

/** @titleBy title */
export interface ExtraMenu {
  /**
   * @title Icon
   */
  icon?: AvailableIcons;
  /** @title Title */
  title: string;
  links: ExtraLink[];
  /** @description Color of the menu text */
  textColor?: Colors;
  /** @description Color of the menu icon */
  iconColor?: Colors;
  /** @description Size of the menu text */
  textSize?: FontSize;
  /** @description Font weight text */
  fontWeight?: FontWeight;
}

export interface Mobile {
  logo: ImageWidget;
  textGoBack: string;
}

export interface Menu {
  links: Department[];
  /** @title Extra links */
  extraLinks?: ExtraMenu[];
  /** @title Languages */
  languages: ExtraMenu & { hide?: boolean };
  /** @description Hide the secondary gray menu */
  hideSecondaryMenu?: boolean;
  /** @description This field is to render the right name of the btn in desktop that open the menu */
  allCategoriesText: string;
  mobile: Mobile;
  menuText: string;
}

export interface Props {
  menu: Department[];
  /** @title Extra links */
  extraLinks?: ExtraMenu[];
  /** @title Languages */
  languages: ExtraMenu & { hide?: boolean };
  /** @description Hide the secondary gray menu */
  hideSecondaryMenu?: boolean;
  /** @description This field is to render the right name of the btn in desktop that open the menu */
  allCategoriesText: string;
  menuText: string;
  mobile: Mobile;
}

export default function loader(
  props: Props,
  _req: Request,
  _ctx: AppContext,
): Menu {
  return { links: props.menu, ...props };
}
