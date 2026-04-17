import { BlogPostPage } from "apps/blog/types.ts";
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
   * @title Blogpost Page integration
   */
  postPage: BlogPostPage | null;
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

const useUrlRebased = (url: string, categorySlug?: string) => {
  if (!categorySlug) return null;
  const urlObj = new URL(url);
  urlObj.pathname = `/blog/${categorySlug}`;
  return urlObj.href;
};

export default function BlogPostBreadcrumb(
  { postPage, spacing, siteTemplate, url }: ReturnType<typeof loader>,
) {
  if (!postPage) return <></>;
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
      label: postPage?.post.categories[0]?.name ?? "Blog",
      href: useUrlRebased(url, postPage?.post.categories[0]?.slug) ?? "/blog",
      overrideFontColor,
    },
    {
      label: postPage.post.title,
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

export function loader(props: Props, req: Request, ctx: AppContext) {
  const { siteTemplate } = ctx;
  return {
    ...props,
    url: req.url,
    siteTemplate,
  };
}
