import { BlogPostPage, Review } from "apps/blog/types.ts";
import { ComponentProps, useComponent } from "../../sections/Component.tsx";
import { clx } from "../../utils/clx.ts";
import { LANGUAGE_DIFFS } from "../../utils/constants.tsx";
import CommentCard from "./CommentCard.tsx";

interface Props {
  page: BlogPostPage | null;
  commentsPerPage: number;
  comments?: Review[];
  commentsPage: number;
  language: "EN" | "ES";
  siteTemplate: "elux" | "frigidaire";
}

export default function CommentResult(
  {
    page,
    commentsPerPage,
    comments,
    commentsPage,
    language,
    siteTemplate,
  }: ComponentProps<
    typeof loader
  >,
) {
  if (!page || !comments || comments.length === 0) {
    return <></>;
  }
  const commentsQty = page.post.review?.length ?? 0;
  const totalPages = Math.ceil(commentsQty / commentsPerPage);
  const hasNext = totalPages > commentsPage;
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  return (
    <>
      {comments?.map((comment) => (
        <CommentCard
          comment={comment}
          siteTemplate={siteTemplate}
          language={language}
        />
      ))}
      {hasNext && (
        <a
          rel="next"
          class={clx(
            "btn btn-ghost w-full sm:w-max self-center",
            styling.pagination,
          )}
          hx-post={useComponent<Props>(import.meta.url, {
            page,
            commentsPerPage,
            commentsPage: commentsPage + 1,
            language,
            siteTemplate,
          })}
          hx-swap="outerHTML"
          hx-select="section>*"
        >
          <span class="inline [.htmx-request_&]:hidden">
            {LANGUAGE_DIFFS[language].blogDetails.showMore}
          </span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      )}
    </>
  );
}

export function loader(props: Props) {
  return props;
}

export function action(
  { page, commentsPage, commentsPerPage, ...rest }: Props,
) {
  if (!page) {
    return {
      page,
      ...rest,
    };
  }
  const commentsQty = page.post.review?.length ?? 0;
  const startIndex = (commentsPage - 1) * commentsPerPage;
  const endIndex = Math.min(startIndex + commentsPerPage, commentsQty);
  const comments = page.post.review?.slice(startIndex, endIndex) ?? [];

  return {
    ...rest,
    page,
    commentsPage,
    commentsPerPage,
    comments,
  };
}

const ELUX_STYLING = {
  pagination:
    "text-base text-white bg-primary font-medium lg:px-12 rounded-sm hover:bg-warning",
};

const FRIGIDAIRE_STYLING = {
  pagination:
    "text-sm text-white bg-primary font-medium px-10 rounded-[50px] min-h-10.5 h-10.5 self-center leading-6",
};
