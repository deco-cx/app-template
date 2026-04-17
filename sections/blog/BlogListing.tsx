/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="esnext" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { useId } from "../../sdk/useId.ts";
import { BlogPostListingPage } from "apps/blog/types.ts";
import Container from "../container/Container.tsx";
import { SpacingConfig } from "../container/Container.tsx";
import { type SectionProps } from "@deco/deco";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import { clx } from "../../utils/clx.ts";
import Icon from "../../components/ui/Icon.tsx";
import { AppContext } from "../../mod.ts";
import { LANGUAGE_DIFFS } from "../../utils/constants.tsx";
import PostCard from "../../components/blog/PostCard.tsx";

interface Layout {
  /**
   * @title Pagination
   * @description Pagination format
   */
  pagination?: "show-more" | "pagination";
  /**
   * @title Show the number of results founded
   */
  showResultsQuantity?: boolean;
}

export type SortBy =
  | "date_desc"
  | "date_asc"
  | "title_asc"
  | "title_desc";

const SORT_BY_QUERY_PARAM = "sortBy";
const SORT_BY_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: "date_desc", label: "Más reciente" },
  { value: "date_asc", label: "Más viejo" },
  { value: "title_asc", label: "Título (A-Z)" },
  { value: "title_desc", label: "Título (Z-A)" },
];

export interface Props {
  /**
   * @title Section title
   */
  title?: string;
  /**
   * @title Post listing integration
   */
  page: BlogPostListingPage | null;
  /**
   * @title Layout
   */
  layout?: Layout;
  /**
   * @title Container spacing
   */
  spacing?: SpacingConfig;
  /**
   * @ignore
   */
  partial?: "hideMore" | "hideLess" | null;
}

function getSortByFromUrl(url: string): SortBy {
  const parsed = new URL(url).searchParams.get(SORT_BY_QUERY_PARAM);
  return SORT_BY_OPTIONS.some(({ value }) => value === parsed)
    ? (parsed as SortBy)
    : "date_desc";
}

function getUrlWithSortBy(url: string, sortBy: SortBy) {
  const parsed = new URL(url);

  // Ensure the URL query string starts with `?sortBy=...`
  // while preserving other existing query params.
  const otherParams = Array.from(parsed.searchParams.entries()).filter(
    ([key]) => key !== SORT_BY_QUERY_PARAM,
  );

  parsed.search = "";
  parsed.searchParams.set(SORT_BY_QUERY_PARAM, sortBy);
  for (const [key, value] of otherParams) {
    parsed.searchParams.append(key, value);
  }

  return parsed.href;
}

const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    url = final.href;
  }
  return url;
};


function PageResult(
  props: SectionProps<typeof loader> & {
    isDesktop: boolean;
  },
) {
  const url = new URL(props.url);
  const { layout, partial } = props;
  const page = props.page!;
  const { pageInfo } = page;
  const zeroIndexedOffsetPage = pageInfo.currentPage - 1;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url.href);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url.href);
  const infinite = layout?.pagination !== "pagination";
  const styling =
    props.siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  const partialPrev = useSection({
    href: prevPageUrl,
    props: {
      partial: "hideMore",
    },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: {
      partial: "hideLess",
    },
  });
  return (
    <div class={clx("flex flex-col")}>
      {/* Hide less section */}
      <div
        class={clx(
          "w-full flex flex-row justify-center mb-8",
          (!prevPageUrl || partial === "hideLess" || !infinite) && "hidden",
        )}
        hx-swap="outerHTML"
        hx-get={partialPrev}
        hx-trigger="click from:a[rel='prev']"
        hx-select="section>*"
      >
        <a
          rel="prev"
          class={clx("btn btn-ghost max-lg:w-full", styling.pagination)}
        >
          <span class="inline [.htmx-request_&]:hidden">
            {LANGUAGE_DIFFS[props.language].listingBlogs.showLess}
          </span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>
      <BlogDataList {...props} />
      {/* Pagination */}
      {infinite ? (
        <>
          {/* Show more section */}
          <div
            class="w-full flex flex-row justify-center"
            hx-swap="outerHTML"
            hx-select="section>*"
            hx-get={partialNext}
            hx-trigger="click from:a[rel='next']"
          >
            <a
              rel="next"
              class={clx(
                "btn btn-ghost max-lg:w-full",
                (!nextPageUrl || partial === "hideMore") && "hidden",
                styling.pagination,
              )}
            >
              <span class="inline [.htmx-request_&]:hidden">
                {LANGUAGE_DIFFS[props.language].listingBlogs.showMore}
              </span>
              <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
            </a>
          </div>
        </>
      ) : (
        <div class="w-full flex justify-center mt-4">
          {/* Classic pagination section */}
          <div class={clx("join")}>
            <a
              rel="prev"
              aria-label="previous page link"
              href={prevPageUrl ?? "#"}
              disabled={!prevPageUrl}
              class="btn btn-ghost join-item group !bg-white"
            >
              <Icon
                id="chevron-right"
                class={clx(
                  "rotate-180 text-primary",
                  nextPageUrl && "opacity-50",
                )}
              />
            </a>
            <span class="btn btn-ghost join-item text-primary">
              {LANGUAGE_DIFFS[props.language].listingBlogs.page}{" "}
              {zeroIndexedOffsetPage + 1}
            </span>
            <a
              rel="next"
              aria-label="next page link"
              href={nextPageUrl ?? "#"}
              disabled={!nextPageUrl}
              class="btn btn-ghost join-item !bg-white"
            >
              <Icon
                id="chevron-right"
                class={clx("text-primary", prevPageUrl && "opacity-50")}
              />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogDataList(props: SectionProps<typeof loader>) {
  const { posts } = props.page!;
  return (
    <div
      class={clx(
        "grid place-items-center grid-cols-1 gap-y-6 pb-6",
        "lg:grid-cols-3 lg:gap-5 lg:gap-y-8",
        "lg:w-full lg:mb-3",
      )}
    >
      {/* Post cards */}
      {posts?.map((post) => (
        <PostCard
          template={props.siteTemplate}
          post={post}
          url={props.url}
          shelfSize="medium"
        />
      ))}
    </div>
  );
}
function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const isDesktop = useDevice() === "desktop";
  const { partial } = props;
  return (
    <div id={container} class="w-full">
      {partial ? (
        <PageResult {...props} isDesktop={isDesktop} />
      ) : (
        <div class={clx(props.hasTitleOrResultsQty && "mt-8")}>
          <PageResult {...props} isDesktop={isDesktop} />
        </div>
      )}
    </div>
  );
}

export default function BlogListing({
  page,
  title,
  ...props
}: SectionProps<typeof loader>) {
  const styling =
    props.siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  const currentSortBy = getSortByFromUrl(props.url);
  if (!page?.posts) {
    return (
      <Container
        spacing={props.spacing}
        class="px-6 lg:container justify-items-center"
      >
        <NotFound language={props.language} />
      </Container>
    );
  }
  if (props.partial) {
    return <Result {...props} page={page} />;
  }
  return (
    <Container spacing={props.spacing} class="px-6 lg:container">
      <div class="flex justify-between items-center">
        <div>
          {/** Title goes here */}
          {title && <h2 class={clx(styling.title)}>{title}</h2>}
          {props.layout?.showResultsQuantity && (
            <span class={styling.results}>
              {`${page.pageInfo.records} ${
                LANGUAGE_DIFFS[props.language].listingBlogs.results
              }`}
            </span>
          )}
        </div>
        {/* Sort dropdown */}
        <div class="flex items-center justify-end">
          <label for="blog-sort-by" class="sr-only">
            Ordenar por
          </label>
          <select
            id="blog-sort-by"
            name="sortBy"
            class={clx(
              "select w-full rounded border-xs border-warning text-warning-content",
              "focus:border-warning",
              props.siteTemplate === "elux"
                ? "text-base font-medium"
                : "text-sm font-light pt-1",
            )}
            hx-on:change={useScript(() => {
              const select = event!.currentTarget as HTMLSelectElement;
              globalThis.location.href = select.value;
            })}
          >
            {SORT_BY_OPTIONS.map(({ value, label }) => (
              <option
                value={getUrlWithSortBy(props.url, value)}
                selected={value === currentSortBy}
              >
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Result {...props} page={page} />
    </Container>
  );
}

function NotFound({ language }: { language: "EN" | "ES" }) {
  return (
    <div class="flex flex-col justify-center text-primary font-bold">
      <span>{LANGUAGE_DIFFS[language].listingBlogs.notFound}</span>
      <a
        href="javascript:history.back()"
        class="mt-1 text-base underline cursor-pointer hover:opacity-75 self-center"
      >
        {LANGUAGE_DIFFS[language].listingBlogs.goBack || "Go back"}
      </a>
    </div>
  );
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  const { language, siteTemplate } = ctx;
  return {
    ...props,
    url: req.url,
    language,
    siteTemplate,
    hasTitleOrResultsQty: Boolean(
      props.title || props.layout?.showResultsQuantity,
    ),
  };
};

const ELUX_STYLING = {
  title:
    "text-primary text-2xl font-medium max-lg:leading-7 lg:text-2.5xl lg:leading-8",
  results: "text-primary text-base font-medium lg:text-secondary",
  pagination:
    "text-base text-white bg-primary font-medium lg:px-12 rounded-sm hover:bg-warning",
};

const FRIGIDAIRE_STYLING = {
  title: "text-secondary text-base font-medium lg:text-3xl",
  results: "text-secondary text-base",
  pagination:
    "text-sm text-white bg-primary font-medium px-10 rounded-[50px] min-h-10.5 h-10.5 self-center leading-6",
};
