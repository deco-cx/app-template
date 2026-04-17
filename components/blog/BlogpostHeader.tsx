import { BlogPost } from "apps/blog/types.ts";
import { clx } from "../../utils/clx.ts";

interface Props {
  /** @title Blogpost */
  blogpost: BlogPost;
  /** @title Site Template */
  siteTemplate: "elux" | "frigidaire";
}

export default function BlogpostHeader({ blogpost, siteTemplate }: Props) {
  const category = blogpost.categories[0] ?? undefined;
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;

  return (
    <div class="flex flex-col">
      {category && (
        <h2 class={clx(styling.category, "mb-2")}>{category.name}</h2>
      )}
      <h1 class={clx(styling.title, "mb-4")}>{blogpost.title}</h1>
      <p class={clx(styling.excerpt, "mb-8 sm:mb-10")}>{blogpost.excerpt}</p>
      <div
        class={clx(
          "h-0 border-t",
          styling.hr,
        )}
      />
    </div>
  );
}

const ELUX_STYLING = {
  category: "text-neutral text-base font-light",
  title:
    "text-primary text-2.5xl max-sm:leading-8 font-medium sm:text-3.5xl sm:font-semibold",
  excerpt: "text-[#747474] text-base font-medium leading-5",
  hr: "border-[#DEE7EA]",
};

const FRIGIDAIRE_STYLING = {
  category: "text-info text-sm font-light",
  title: clx(
    "text-secondary text-2.5xl max-sm:leading-8 font-normal sm:text-4xl sm:font-semibold",
  ),
  excerpt: "text-info text-sm font-medium",
  hr: "border-warning",
};
