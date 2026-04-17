import HelpCard from "../../components/ui/HelpCard.tsx";
import { AvailableIcons } from "../../components/ui/Icon.tsx";
import { AppContext } from "../../mod.ts";
import { clx } from "../../utils/clx.ts";

export interface Props {
  /**
   * @title Title
   */
  title: string;
  /**
   * @title Cards
   */
  cards: HelpCard[];
}

/**
 * @titleBy title
 */
export interface HelpCard {
  /**
   * @title Icon
   * @format icon-select
   * @options site/loaders/availableIcons.ts
   */
  icon: AvailableIcons;
  title: string;
  description?: string;
  url?: string;
}

export function loader(
  props: Props,
  _req: Request,
  { siteTemplate }: AppContext,
) {
  return { ...props, siteTemplate };
}

export default function HelpCards(
  { title, cards, siteTemplate }: ReturnType<typeof loader>,
) {
  return (
    <div class={"w-full bg-primary"}>
      <div class="container pt-12 md:pt-20 pb-12 md:pb-24 flex flex-col gap-8 max-lg:px-5.5">
        <h2
          class={clx(
            "font-medium text-2xl md:text-2.5xl md:font-semibold text-white",
          )}
        >
          {title}
        </h2>
        <div
          class={clx(
            "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5",
          )}
          data-gtm-block-name="help"
        >
          {cards.map((card) => (
            <HelpCard {...card} siteTemplate={siteTemplate} />
          ))}
        </div>
      </div>
    </div>
  );
}
