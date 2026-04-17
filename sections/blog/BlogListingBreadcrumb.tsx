import { BlogPostListingPage } from "apps/blog/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import { AppContext } from "../../mod.ts";
import { useDevice } from "@deco/deco/hooks";
import Breadcrumb, { Items } from "../Content/Breadcrumb.tsx";
import { Colors } from "../../utils/types.ts";
import {
  ELUX_STYLING,
  FRIGIDAIRE_STYLING,
} from "../../utils/styling/breadcrumb.ts";
interface Props {
  /**
   * @title Blogpost Loader
   */
  listingPage: BlogPostListingPage | null;
  /**
   * @title Blog title in breadcrumb
   */
  fallbackTitle?: string;
  /**
   * @title Disable category in breadcrumb
   * @description If true, the category will not be displayed as last element in breadcrumb
   */
  disableCategoryInBreadcrumb?: boolean;
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

export default function BlogListingBreadcrumb(
  {
    listingPage,
    spacing,
    siteTemplate,
    fallbackTitle,
    disableCategoryInBreadcrumb,
  }: ReturnType<typeof loader>,
) {
  const hasCategoryInBreadcrumb = !!listingPage?.posts && listingPage?.seo &&
    !disableCategoryInBreadcrumb;
  const isDesktop = useDevice() === "desktop";
  const [styling, overrideFontColor, hoverUnderline, firstItem] =
    siteTemplate === "elux"
      ? [
        ELUX_STYLING,
        "secondary" as Colors,
        true,
        isDesktop
          ? {
            label: "Home",
            href: "/",
            overrideFontColor: "secondary",
          }
          : null,
      ]
      : [FRIGIDAIRE_STYLING, "info" as Colors, false, null];

  const breadcrumbItems: Items[] = [
    firstItem,
    {
      label: fallbackTitle ?? "Blog",
      href: "/blog",
      ...hasCategoryInBreadcrumb
        ? {
          overrideFontColor,
        }
        : {
          hoverUnderline,
          overrideFontWeight: "font-normal",
        },
    },
    hasCategoryInBreadcrumb &&
    {
      label: listingPage.seo.title,
      hoverUnderline,
      overrideFontWeight: "font-normal",
    },
  ].filter(Boolean) as Items[];

  return (
    <Container spacing={spacing} class="container">
      <Breadcrumb
        {...styling.breadcrumb}
        items={breadcrumbItems}
        icon={styling.icon[isDesktop ? "desktop" : "mobile"]}
      />
    </Container>
  );
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  const { siteTemplate } = ctx;
  return {
    ...props,
    siteTemplate,
  };
}
