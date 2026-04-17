import type { BlogPost } from "apps/blog/types.ts";
import { AppContext } from "../../mod.ts";
import PostCard from "../../components/blog/PostCard.tsx";
import { clx } from "../../utils/clx.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";

export interface Props {
  /**
   * @description Title of the section
   */
  title: string;
  /**
   * @description Description of the section
   * @format rich-text
   */
  description?: string;
  /**
   * @description Blogpost shelf integration
   */
  blogposts: BlogPost[] | null;
  /**
   * @title Number of columns
   * @description define the number of columns of the grid in desktop
   */
  gridOption?: "2" | "3";
  /**
   * @title Shelf size
   * @description define the shelf size
   */
  shelfSize?: "medium" | "large";
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  return {
    ...props,
    siteTemplate: ctx.siteTemplate,
    url: req.url,
  };
};

export default function BlogShelf(
  {
    siteTemplate,
    title,
    description,
    blogposts,
    url,
    gridOption = "3",
    shelfSize = "medium",
    spacing,
  }: ReturnType<
    typeof loader
  >,
) {
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  return (
    <div class={clx("w-full h-full", styling.bgColor)}>
      <Container
        class={clx(
          "container flex flex-col gap-8 max-lg:px-6",
          SIZES[shelfSize],
        )}
        spacing={spacing}
      >
        <div class="flex flex-col gap-2">
          <h2 class={styling.title}>{title}</h2>
          {description && (
            <div
              class={styling.description}
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          )}
        </div>
        <div
          class={clx(
            "grid grid-cols-1 gap-6 lg:gap-5",
            GRID_OPTIONS[gridOption],
          )}
          data-gtm-block-name="blog"
        >
          {blogposts?.map((post) => (
            <PostCard
              template={siteTemplate}
              post={post}
              url={url}
              shelfSize={shelfSize}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export const LoadingFallback = (
  { spacing, shelfSize = "medium", description, gridOption = "3" }: Partial<
    Props
  >,
) => {
  const cardArray = gridOption === "3" ? [1, 2, 3] : [1, 2];
  return (
    <div class="w-full h-full">
      <Container
        class={clx(
          "container flex flex-col gap-8 max-lg:px-6",
          SIZES[shelfSize],
        )}
        spacing={spacing}
      >
        <div class="flex flex-col gap-4">
          <div className="skeleton h-7 w-52"></div>
          {description && (
            <div className="w-full flex flex-col gap-2">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full lg:hidden"></div>
              <div className="skeleton h-4 w-full lg:hidden"></div>
              <div className="skeleton h-4 w-40"></div>
            </div>
          )}
        </div>
        <div
          class={clx(
            "grid grid-cols-1 gap-6 lg:gap-5",
            GRID_OPTIONS[gridOption],
          )}
        >
          {cardArray.map((_) => <CardSkeleton shelfSize={shelfSize} />)}
        </div>
      </Container>
    </div>
  );
};

const CardSkeleton = (
  { shelfSize = "medium" }: { shelfSize: "medium" | "large" },
) => {
  return (
    <div
      className={clx(
        "w-full flex flex-col gap-4",
        shelfSize === "medium" ? "h-[250px]" : "h-[250px] lg:h-[407px]",
      )}
    >
      {/* Image skeleton */}
      <div className="w-full h-3/4 skeleton rounded-lg" />

      {/* Category skeleton */}
      <div className="skeleton h-4 w-24" />

      {/* Title skeleton - two lines */}
      <div className="flex flex-col gap-2">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    </div>
  );
};

const ELUX_STYLING = {
  bgColor: "bg-base-content",
  title: "text-2.5xl max-lg:text-2xl font-medium text-primary",
  description:
    "font-light text-secondary [&_strong]:font-bold [&_a]:underline [&_a]:underline-offset-4 max-lg:leading-[21px] leading-[19.4px]",
};

const FRIGIDAIRE_STYLING = {
  bgColor: "bg-base-300",
  title: "text-3xl max-lg:text-xl font-medium text-secondary",
  description:
    "text-sm font-light text-secondary [&_a]:underline [&_a]:underline-offset-1",
};

const GRID_OPTIONS = {
  "2": "lg:grid-cols-2",
  "3": "lg:grid-cols-3",
};

const SIZES = {
  "medium": "!max-w-[863px]",
  "large": "",
};
