import { Review } from "apps/blog/types.ts";
import { formatRelativeTime } from "../../utils/utils.ts";
import { LANGUAGE_DIFFS } from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";

export interface Props {
  comment: Review;
  language: "ES" | "EN";
  siteTemplate: "elux" | "frigidaire";
}

export default function CommentCard(
  { comment, language, siteTemplate }: Props,
) {
  const { isAnonymous, author, reviewBody } = comment;
  const authorName = isAnonymous
    ? LANGUAGE_DIFFS[language].blogDetails.anonymous
    : author?.givenName ?? author?.name;
  const time = formatRelativeTime(comment.datePublished!, language);
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;

  return (
    <div class={clx("py-8 px-10 flex flex-col gap-2", styling.container)}>
      {/** Card title */}
      <div class="flex flex-row justify-between items-center">
        {/** name and time */}
        <div class="flex flex-row gap-4 items-center">
          <span class={styling.authorName}>{authorName}</span>
          <span class={styling.time}>{time}</span>
        </div>
      </div>
      {/** Card body */}
      <div
        class={styling.reviewBody}
        dangerouslySetInnerHTML={{ __html: reviewBody! }}
      />
    </div>
  );
}

const ELUX_STYLING = {
  container: "border border-[#DEE7EA] rounded",
  authorName: "text-primary font-medium",
  time: "text-neutral text-sm font-light",
  reviewBody: "text-secondary font-light",
};

const FRIGIDAIRE_STYLING = {
  container: "border border-neutral rounded",
  authorName: "text-secondary",
  time: "text-info text-sm font-light",
  reviewBody: "text-secondary text-sm font-light",
};
