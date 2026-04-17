import CategoryCard from "../../components/ui/CategoryCard.tsx";
import { AvailableIcons } from "../../components/ui/Icon.tsx";
import { AppContext } from "../../mod.ts";
import { clx } from "../../utils/clx.ts";

export interface Props {
  title: string;
  cards: CategoryCard[];
}

/**
 * @titleBy title
 */
export interface CategoryCard {
  /**
   * @title Icon
   * @format icon-select
   * @options site/loaders/availableIcons.ts
   */
  icon: AvailableIcons;
  title: string;
  url?: string;
}

export function loader(
  props: Props,
  _req: Request,
  { siteTemplate }: AppContext,
) {
  return { ...props, siteTemplate };
}

export default function CategoryCards(
  { title, cards, siteTemplate }: ReturnType<typeof loader>,
) {
  const style = siteTemplate === "frigidaire" ? FRIGIDAIRE_STYLE : ELUX_STYLE;

  return (
    <div class={clx("w-full", style.bgColor)}>
      <div class="container pt-9 md:pt-12 pb-6 md:pb-16 flex flex-col gap-6 md:gap-8 max-lg:px-5.5">
        <h2
          class={clx(
            style.textColors,
            "font-medium text-2.5xl md:text-3.5xl md:font-semibold self-center",
          )}
        >
          {title}
        </h2>
        <div
          class={clx(
            "flex flex-wrap justify-center gap-1 md:gap-4",
            style.textColors,
          )}
          data-gtm-block-name="our-products"
        >
          {cards.map((card) => <CategoryCard {...card} />)}
        </div>
      </div>
    </div>
  );
}

const ELUX_STYLE = {
  bgColor: "bg-[#DEE7EA]",
  textColors: "text-primary",
};

const FRIGIDAIRE_STYLE = {
  bgColor: "bg-base-300",
  textColors: "text-secondary",
};
