import { BlogPostPage, Review } from "apps/blog/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import { AppContext } from "../../mod.ts";
import CommentResult from "../../components/blog/CommentResult.tsx";
import SubmitComment, {
  CommentSection,
  Props as SubmitCommentProps,
} from "../../components/blog/SubmitComment.tsx";

export interface Props {
  /**
   * @title Blogpost Page integration
   */
  page: BlogPostPage | null;
  /**
   * @title Section Title
   */
  title: string;
  /**
   * @title Section Title - Comment
   */
  titleComment: string;
  /**
   * @title Comments per page
   */
  commentsPerPage: number;
  /**
   * @title Comment Section Props
   */
  sectionConfig: CommentSection;
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
  /**
   * @ignore
   */
  comments?: Review[];
}

export interface TextboxProps {
  /**
   * @title Maximum lines
   */
  maxLines?: number;
  /**
   * @title Maximum characters
   */
  maxLength?: number;
}

export default function Comments(
  {
    spacing,
    title,
    comments,
    commentsPerPage,
    page,
    titleComment,
    siteTemplate,
    language,
    sectionConfig,
  }: ReturnType<
    typeof loader
  >,
) {
  if (!page) {
    return <></>;
  }

  const hasComments = !!(comments && comments.length > 0);
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;

  return (
    <Container
      class="container max-w-[863px] px-6 sm:px-0 flex flex-col"
      spacing={spacing}
    >
      {hasComments
        ? (
          <>
            <h2 class={styling.commentTitle}>
              {title}
            </h2>
            <div class="pt-6 pb-10 sm:pt-8 sm:pb-12 max-w-[687px] flex flex-col gap-4">
              <CommentResult
                comments={comments}
                commentsPerPage={commentsPerPage}
                page={page}
                commentsPage={1}
                siteTemplate={siteTemplate}
                language={language}
              />
            </div>
            <div class="max-w-[687px]">
              <h2 class={styling.submitTitle}>
                {titleComment}
              </h2>
              {
                <Submit
                  itemReviewed={page?.post.slug!}
                  siteTemplate={siteTemplate}
                  sectionConfig={sectionConfig}
                />
              }
            </div>
          </>
        )
        : (
          <>
            <h2 class={styling.submitTitle}>
              {titleComment}
            </h2>
            {
              <Submit
                itemReviewed={page?.post.slug!}
                siteTemplate={siteTemplate}
                sectionConfig={sectionConfig}
              />
            }
          </>
        )}
    </Container>
  );
}

const Submit = (
  props: SubmitCommentProps,
) => {
  return <SubmitComment {...props} />;
};

export function loader(
  {
    commentsPerPage = 5,
    page,
    ...rest
  }: Props,
  _req: Request,
  ctx: AppContext,
) {
  if (!page) {
    return {
      ...rest,
      page,
      commentsPerPage,
      language: ctx.language,
      siteTemplate: ctx.siteTemplate,
    };
  }

  const commentsQty = page.post.review?.length ?? 0;
  const endIndex = Math.min(commentsPerPage, commentsQty);
  const comments = page.post.review?.slice(0, endIndex) ?? [];
  return {
    ...rest,
    commentsPerPage,
    page,
    language: ctx.language,
    siteTemplate: ctx.siteTemplate,
    comments,
  };
}

const ELUX_STYLING = {
  commentTitle: "text-primary font-medium text-xl",
  submitTitle: "text-primary font-medium text-xl pb-6",
};

const FRIGIDAIRE_STYLING = {
  commentTitle: "text-secondary font-medium text-xl",
  submitTitle: "text-secondary font-medium text-xl pb-6",
};
