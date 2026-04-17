import { BlogPost } from "apps/blog/types.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { clx } from "../../utils/clx.ts";

export interface Props {
  template: "elux" | "frigidaire";
  post: BlogPost;
  url: string;
  shelfSize?: "medium" | "large";
}

const buildPostUrl = (url: string, postSlug: string, categorySlug: string) => {
  const newUrl = new URL(url);
  const pathname = `blog/${categorySlug}/${postSlug}`;
  return new URL(pathname, newUrl.origin).href;
};

export default function PostCard(
  { template, post, url, shelfSize = "medium" }: Props,
) {
  const { category, title, borders } = template === "elux"
    ? ELUX_STYLING
    : FRIGIDAIRE_STYLING;
  const sizes = SIZES_STYLING[shelfSize];
  return (
    <a
      class="flex flex-col w-full h-full"
      href={buildPostUrl(url, post.slug, post.categories[0].slug)}
      data-gtm-element="blog-article"
      data-gtm-value={post.title}
    >
      <Picture class="object-contain">
        <Source
          media="(max-width: 640px)"
          alt={post.alt ?? ""}
          src={post.image!}
          width={327}
          height={160}
          class="object-contain w-full"
        />
        <Source
          media="(min-width: 640px)"
          alt={post.alt ?? ""}
          src={post.image!}
          width={274}
          height={160}
          class="object-contain w-full"
        />
        <img
          alt={post.alt ?? ""}
          src={post.image!}
          class="w-full"
        />
      </Picture>
      <div
        class={clx("flex flex-col bg-white h-full", borders, sizes.contentDiv)}
      >
        <p class={clx(category, sizes.category)}>
          {post.categories[0].name}
        </p>
        <p class={clx(title, "pt-2", sizes.title)}>{post.title}</p>
        <div class="flex-grow" />
      </div>
    </a>
  );
}

const ELUX_STYLING = {
  category: "text-neutral",
  title: "text-secondary leading-[20px]",
  borders: "border-[#DEE7EA] border-b border-x",
};

const FRIGIDAIRE_STYLING = {
  category: "text-info !font-light max-lg:text-sm",
  title: "text-secondary",
  borders: "border-neutral border-b border-x",
};

const SIZES_STYLING = {
  "medium": {
    category: "text-sm font-light",
    title: "font-medium text-base",
    contentDiv: "py-3 px-4",
  },
  "large": {
    category: "text-base font-light lg:font-medium",
    title: "font-medium text-base lg:text-xl",
    contentDiv: "py-3 px-4 lg:py-4 lg:px-5",
  },
};
