import {
  CountrySelectStyle,
  StoreCardStyle,
} from "../../../../sections/Institutional/WhereToBuy.tsx";
import { TextProps } from "../../../types.ts";

const FRIGIDAIRE_TITLE_TEXT_STYLE_MOBILE = {
  fontColor: "primary",
  fontSize: "text-2.5xl",
  fontWeight: "font-semibold",
} as Omit<TextProps, "text">;

const FRIGIDAIRE_DESCRIPTION_TEXT_STYLE_MOBILE = {
  fontColor: "base-content",
  fontSize: "text-sm",
} as Omit<TextProps, "text">;

const FRIGIDAIRE_TITLE_TEXT_STYLE_DESKTOP = {
  fontColor: "primary",
  fontSize: "text-4xl",
  fontWeight: "font-semibold",
} as Omit<TextProps, "text">;

const FRIGIDAIRE_DESCRIPTION_TEXT_STYLE_DESKTOP = {
  fontColor: "base-content",
  fontSize: "text-sm",
  fontWeight: "font-light",
} as Omit<TextProps, "text">;

const ELUX_TITLE_TEXT_STYLE_MOBILE = {
  fontColor: "primary",
  fontSize: "text-2.5xl",
} as Omit<TextProps, "text">;

const ELUX_DESCRIPTION_TEXT_STYLE_MOBILE = {
  fontColor: "secondary",
  fontSize: "text-sm",
} as Omit<TextProps, "text">;

const ELUX_TITLE_TEXT_STYLE_DESKTOP = {
  fontColor: "primary",
  fontSize: "text-4xl",
} as Omit<TextProps, "text">;

const ELUX_DESCRIPTION_TEXT_STYLE_DESKTOP = {
  fontColor: "secondary",
  fontSize: "text-sm",
} as Omit<TextProps, "text">;

const FRIGIDAIRE_STORE_CARD_STYLE_DESKTOP = {
  fontColor: "secondary",
  titleFontSize: "text-base",
  descriptionFontSize: "text-sm",
  imagesSizes: {
    mobile: {
      width: 327,
      height: 148,
    },
    desktop: {
      height: 174,
      width: 333,
    },
  },
  hoverColorBorder: "neutral",
  grid: "3",
  gap: "5",
  colorBorder: "base-200",
  descriptionFontColor: "secondary",
} as StoreCardStyle;

const FRIGIDAIRE_STORE_CARD_STYLE_MOBILE = {
  fontColor: "secondary",
  titleFontSize: "text-base",
  descriptionFontSize: "text-sm",
  imagesSizes: {
    mobile: {
      width: 327,
    },
    desktop: {
      height: 174,
      width: 333,
    },
  },
  hoverColorBorder: "neutral",
  grid: "3",
  gap: "5",
  colorBorder: "base-200",
  descriptionFontColor: "secondary",
} as StoreCardStyle;

const FRIGIDAIRE_COUNTRY_SELECT = {
  borderColor: "neutral",
  rounded: "regular",
  selectColor: "info",
  optionsColor: "info",
  hoverColor: "error-content",
  hoverFontColor: "secondary",
} as CountrySelectStyle;

const ELUX_COUNTRY_SELECT = {
  borderColor: "primary",
  rounded: "sm",
  selectColor: "neutral",
  optionsColor: "secondary",
  hoverColor: "base-content",
  hoverFontColor: "secondary",
} as CountrySelectStyle;

const FRIGIDAIRE_MOBILE = {
  title: FRIGIDAIRE_TITLE_TEXT_STYLE_MOBILE,
  description: FRIGIDAIRE_DESCRIPTION_TEXT_STYLE_MOBILE,
  storeCardStyle: FRIGIDAIRE_STORE_CARD_STYLE_MOBILE,
  countrySelectStyle: FRIGIDAIRE_COUNTRY_SELECT,
};

const FRIGIDAIRE_DESKTOP = {
  title: FRIGIDAIRE_TITLE_TEXT_STYLE_DESKTOP,
  description: FRIGIDAIRE_DESCRIPTION_TEXT_STYLE_DESKTOP,
  storeCardStyle: FRIGIDAIRE_STORE_CARD_STYLE_DESKTOP,
  countrySelectStyle: FRIGIDAIRE_COUNTRY_SELECT,
};

const ELUX_MOBILE = {
  title: ELUX_TITLE_TEXT_STYLE_MOBILE,
  description: ELUX_DESCRIPTION_TEXT_STYLE_MOBILE,
  storeCardStyle: FRIGIDAIRE_STORE_CARD_STYLE_DESKTOP,
  countrySelectStyle: ELUX_COUNTRY_SELECT,
};

const ELUX_DESKTOP = {
  title: ELUX_TITLE_TEXT_STYLE_DESKTOP,
  description: ELUX_DESCRIPTION_TEXT_STYLE_DESKTOP,
  storeCardStyle: FRIGIDAIRE_STORE_CARD_STYLE_DESKTOP,
  countrySelectStyle: ELUX_COUNTRY_SELECT,
};

const stylingDiff = {
  frigidaire: {
    mobile: FRIGIDAIRE_MOBILE,
    desktop: FRIGIDAIRE_DESKTOP,
  },
  elux: {
    mobile: ELUX_MOBILE,
    desktop: ELUX_DESKTOP,
  },
};

export default stylingDiff;
