import { Picture, Source } from "apps/website/components/Picture.tsx";
import { clx } from "../../utils/clx.ts";
import type { ImageCard as ImageCardType } from "../../sections/Content/ImageCards.tsx";

export interface Props {
  template: "elux" | "frigidaire";
  card: ImageCardType;
  shelfSize?: "medium" | "large";
}

export default function ImageCard(
  { template, card, shelfSize = "medium" }: Props,
) {
  const { category, title, borders } = template === "elux"
    ? ELUX_STYLING
    : FRIGIDAIRE_STYLING;
  const sizes = SIZES_STYLING[shelfSize];
  return (
    <a
      class={clx(
        "flex flex-col w-full h-full",
        card?.link ? "cursor-pointer" : "cursor-default pointer-events-none",
      )}
      href={card?.link ?? "#"}
    >
      <Picture class="object-contain">
        <Source
          media="(max-width: 640px)"
          alt={card.headline ?? ""}
          src={card.image!}
          width={327}
          height={160}
          class="object-contain w-full"
        />
        <Source
          media="(min-width: 640px)"
          alt={card.headline ?? ""}
          src={card.image!}
          width={274}
          height={160}
          class="object-contain w-full"
        />
        <img
          alt={card.headline ?? ""}
          src={card.image!}
          class="w-full"
        />
      </Picture>
      <div
        class={clx(
          "flex flex-col bg-white h-full",
          borders,
          sizes.contentDiv,
        )}
      >
        {card.headline && (
          <p class={clx(category, sizes.category)}>
            {card.headline}
          </p>
        )}
        <p class={clx(title, "pt-2", sizes.title)}>{card.text}</p>
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
