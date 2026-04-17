import { BlogPostPage } from "apps/blog/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import BlogpostHeader from "../../components/blog/BlogpostHeader.tsx";
import { AppContext } from "../../mod.ts";
import { render } from "npm:preact-render-to-string@6.4.0";
import YoutubeVideo from "../../components/ui/YoutubeVideo.tsx";
import { clx } from "../../utils/clx.ts";
import {
  ElectrluxStyle,
  FrigidaireStyle,
} from "../../utils/styling/blog/blogpost.tsx";
export const IFRAME_KEY = "[youtube]";
export const IFRAME_KEY_REGEX = /\[youtube\]\[(.*?)\]/;

interface Props {
  /** @title Blogpost Page integration */
  postPage: BlogPostPage | null;
  /** @title Spacing */
  spacing?: SpacingConfig;
}

export default function BlogpostContent(
  { postPage, spacing, siteTemplate }: ReturnType<typeof loader>,
) {
  if (!postPage) {
    return (
      <Container spacing={spacing} class="container px-6 sm:px-0">
        Not found!
      </Container>
    );
  }
  const hasIframe = postPage.post.content.includes(IFRAME_KEY);
  const [styling, PostCss] = siteTemplate === "elux"
    ? [ELUX_STYLING, ElectrluxStyle]
    : [FRIGIDAIRE_STYLING, FrigidaireStyle];
  const url = hasIframe
    ? postPage.post.content.match(IFRAME_KEY_REGEX)?.[1]
    : null;
  const renderContent = hasIframe && url
    ? postPage.post.content.replace(
      IFRAME_KEY_REGEX,
      (_match) =>
        render(
          <YoutubeVideo url={url} class="min-h-[185px] sm:min-h-[486px]" title="YouTube video player" />,
        ),
    )
    : postPage.post.content;

  return (
    <Container
      spacing={spacing}
      class="container max-w-[863px] px-6 sm:px-0 flex flex-col"
    >
      <BlogpostHeader blogpost={postPage.post} siteTemplate={siteTemplate} />
      <div
        class={clx(
          "flex flex-col mt-8 sm:mt-10 article-content",
          styling.content,
        )}
        dangerouslySetInnerHTML={{ __html: renderContent }}
      />
      {PostCss}
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
const ELUX_STYLING = {
  content: "text-base font-light text-secondary",
};

const FRIGIDAIRE_STYLING = {
  content: "text-sm font-light text-secondary",
};
