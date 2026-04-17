import Icon, { AvailableIcons } from "../ui/Icon.tsx";
import Collapse from "./Collapse.tsx";
import { Colors, FontWeight } from "../../utils/types.ts";
import { clx } from "../../utils/clx.ts";
import { TEXT_COLORS } from "../../utils/constants.tsx";
import { useDevice } from "@deco/deco/hooks";

/** @titleBy title */
export interface ItemText {
  title: string;
  link: string;
  isBlank?: boolean;
  fontWeight?: FontWeight;
}

/** @titleBy icon */
export interface ItemSocial {
  /**
   * @title Icon
   * @format icon-select
   * @options site/loaders/availableIcons.ts
   */
  icon: AvailableIcons;
  link: string;
  isBlank?: boolean;
}

/** @titleBy title */
export interface Category {
  type: "social" | "text";
  title: string;
  link: string;
  isBlank?: boolean;
  items: ItemSocial[] | ItemText[];
  textColor?: Colors;
}

/**
 * @titleBy title
 * @title {{#categories}}{{{title}}} {{/categories}}
 */
export interface Props {
  categories: Category[];
  justifyBetween?: boolean;
}

const SocialItems = ({ title, link, isBlank, items, textColor }: Category) => {
  return (
    <div
      class="flex flex-col gap-3 max-md:border-b border-base-200 max-md:pb-8 md:mt-16"
      data-gtm-block-name="footer"
    >
      <a
        class={clx(
          "font-semibold text-sm",
          textColor && TEXT_COLORS[textColor],
        )}
        href={link}
        target={isBlank ? "_blank" : "_self"}
        rel={isBlank ? "noopener noreferrer" : ""}
        data-gtm-element="footer-link"
        data-gtm-value={title}
      >
        {title}
      </a>
      <div class="flex justify-start gap-8" data-gtm-block-name="footer">
        {(items as unknown as ItemSocial[]).map(({ link, icon, isBlank }) => (
          <a
            class="text-primary"
            href={link}
            target={isBlank ? "_blank" : "_self"}
            rel={isBlank ? "noopener noreferrer" : ""}
            data-gtm-element="footer-link"
            data-gtm-value={icon}
          >
            <Icon id={icon} />
          </a>
        ))}
      </div>
    </div>
  );
};

const TextItems = (
  { title, link, isBlank, items, textColor, justifyBetween }: Category & {
    justifyBetween?: boolean;
  },
) => {
  return (
    <div
      class={clx("flex flex-col gap-4", !justifyBetween && "w-[245px]")}
      data-gtm-block-name="footer"
    >
      <a
        class={clx(
          "font-semibold text-sm",
          textColor && TEXT_COLORS[textColor],
        )}
        href={link}
        target={isBlank ? "_blank" : "_self"}
        rel={isBlank ? "noopener noreferrer" : ""}
        data-gtm-element="footer-link"
        data-gtm-value={title}
      >
        {title}
      </a>
      <div class="flex flex-col gap-4" data-gtm-block-name="footer">
        {(items as unknown[] as ItemText[]).map((
          { link, title, isBlank, fontWeight },
        ) => (
          <a
            class={clx("text-sm", fontWeight)}
            href={link}
            target={isBlank ? "_blank" : "_self"}
            rel={isBlank ? "noopener noreferrer" : ""}
            data-gtm-element="footer-link"
            data-gtm-value={title}
          >
            {title}
          </a>
        ))}
      </div>
    </div>
  );
};

function Collumn({ categories, justifyBetween }: Props) {
  const device = useDevice();
  return (
    <div>
      <ul class="flex flex-col max-md:gap-6">
        {categories.map((props) => {
          switch (props.type) {
            case "social":
              return <SocialItems {...props} />;
            default:
              return device === "desktop"
                ? <TextItems {...props} justifyBetween={justifyBetween} />
                : <Collapse {...props} />;
          }
        })}
      </ul>
    </div>
  );
}

export default Collumn;
