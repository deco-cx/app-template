import { AvailableIcons } from "../../components/ui/Icon.tsx";
import { Props as BreadcrumbProps } from "../../sections/Content/Breadcrumb.tsx";

export const ELUX_STYLING = {
  breadcrumb: {
    iconSize: 24,
    fontColor: "primary",
    fontSize: "text-sm",
    fontWeight: "font-normal",
    gap: "1",
    disableContainer: true,
  } as Omit<BreadcrumbProps, "items" | "icon">,
  icon: {
    desktop: undefined,
    mobile: "dots-frigidaire" as AvailableIcons,
  },
};

export const FRIGIDAIRE_STYLING = {
  breadcrumb: {
    iconSize: 16,
    fontColor: "primary",
    fontSize: "text-xs",
    fontWeight: "font-light",
    gap: "2",
    disableContainer: true,
  } as Omit<BreadcrumbProps, "items" | "icon">,
  icon: {
    desktop: "home-frigidaire" as AvailableIcons,
    mobile: "home-frigidaire" as AvailableIcons,
  },
};
