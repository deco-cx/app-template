import {
  ListingMainProps,
  PLPBreadcrumbProps,
} from "../../../../sections/Product/ProductListing/ProductListingPage.tsx";

const ELUX_DEFAULT = {
  breadcrumbProps: {
    iconColor: "secondary",
    breadcrumbColor: "primary",
    overrideFirst: {
      item: "Home",
      url: "/",
    },
    iconSize: 16,
    fontSize: "text-sm",
    fontWeight: "font-normal",
    gap: "1",
    hoverUnderline: true,
  } as PLPBreadcrumbProps,
  listingMain: {
    filtersFontColor: "neutral-content",
    filterIconUrl:
      "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/elux-latam/69b170d1-d7e1-460e-877e-2b11c8ffbe47/Vector.png",
    cardStyling: {
      skuStyle: {
        fontColor: "success-content",
        fontSize: "text-sm",
        fontWeight: "font-normal",
      },
      nameStyle: {
        fontColor: "primary",
        fontSize: "text-base",
        fontWeight: "font-medium",
      },
    },
    layout: {
      buttonProps: {
        text: "Show more",
        color: "white",
        hoverColor: "white",
        borderColor: "primary",
        borderWidth: "1",
        fontColor: "primary",
        rounded: "regular",
      },
    },
    startingPage: 1,
  } as ListingMainProps,
};

const FRIGIDAIRE_DEFAULT = {
  breadcrumbProps: {
    iconColor: "primary",
    breadcrumbColor: "primary",
    iconSize: 16,
    fontSize: "text-xs",
    fontWeight: "font-normal",
    gap: "2",
    icon: "home-frigidaire",
  } as PLPBreadcrumbProps,
  listingMain: {
    filtersFontColor: "secondary",
    filterIconUrl:
      "https://deco-sites-assets.s3.sa-east-1.amazonaws.com/elux-nola-us/fdfe8229-be9e-49ad-97de-6767bcff9c2c/Vector.png",
    cardStyling: {
      skuStyle: {
        fontColor: "warning-content",
        fontSize: "text-xxs",
        fontWeight: "font-light",
      },
      nameStyle: {
        fontColor: "secondary",
        fontSize: "text-sm",
        fontWeight: "font-medium",
      },
    },
    layout: {
      buttonProps: {
        text: "Ver más productos",
        color: "white",
        hoverColor: "white",
        borderColor: "primary",
        borderWidth: "2",
        fontColor: "primary",
        rounded: "3xl",
      },
    },
    startingPage: 1,
  } as ListingMainProps,
};

export const productListingStylingDiffs = {
  elux: {
    desktop: ELUX_DEFAULT,
    mobile: {
      ...ELUX_DEFAULT,
      breadcrumbProps: {
        iconColor: "primary",
        breadcrumbColor: "primary",
        iconSize: 16,
        fontSize: "text-sm",
        fontWeight: "font-normal",
        gap: "1",
        hoverUnderline: true,
        icon: "dots-frigidaire",
      } as PLPBreadcrumbProps,
      listingMain: {
        ...ELUX_DEFAULT.listingMain,
        filtersFontColor: "primary",
      } as ListingMainProps,
    },
  },
  frigidaire: { desktop: FRIGIDAIRE_DEFAULT, mobile: FRIGIDAIRE_DEFAULT },
};
