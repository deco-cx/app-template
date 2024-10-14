import { useDevice } from "jsr:@deco/deco@^1.99.1/hooks";
import Icon, { AvailableIcons } from "../ui/Icon.tsx";
import Collapse from "./Collapse.tsx";

/** @titleBy title */
export interface ItemText {
  title: string;
  link: string;
  isBlank?: boolean;
}

/** @titleBy icon */
export interface ItemSocial {
  /**
   * @title Ícone
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
}

/**
 * @titleBy title
 * @title {{#categories}}{{{title}}} {{/categories}}
 */
export interface Props {
  categories: Category[];
}

const SocialItems = ({ title, link, isBlank, items }: Category) => {
  return (
    <div class="flex flex-col gap-3 max-md:border-b border-base-200 max-md:pb-8 md:mt-16">
      <a
        class="text-sm font-semibold"
        href={link}
        target={isBlank ? "_blank" : "_self"}
        rel={isBlank ? "noopener noreferrer" : ""}
      >
        {title}
      </a>
      <div class="flex justify-start gap-8">
        {(items as unknown as ItemSocial[]).map(({ link, icon, isBlank }) => (
          <a
            class="text-primary"
            href={link}
            target={isBlank ? "_blank" : "_self"}
            rel={isBlank ? "noopener noreferrer" : ""}
          >
            <Icon id={icon} />
          </a>
        ))}
      </div>
    </div>
  );
};

const TextItems = ({ title, link, isBlank, items }: Category) => {
  return (
    <div class="flex flex-col gap-2">
      <a
        class="font-semibold text-sm"
        href={link}
        target={isBlank ? "_blank" : "_self"}
        rel={isBlank ? "noopener noreferrer" : ""}
      >
        {title}
      </a>
      <div class="flex flex-col gap-2">
        {(items as unknown[] as ItemText[]).map((
          { link, title, isBlank },
        ) => (
          <a
            class="text-sm"
            href={link}
            target={isBlank ? "_blank" : "_self"}
            rel={isBlank ? "noopener noreferrer" : ""}
          >
            {title}
          </a>
        ))}
      </div>
    </div>
  );
};

function Collumn({ categories }: Props) {
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
                ? <TextItems {...props} />
                : <Collapse {...props} />;
          }
        })}
      </ul>
    </div>
  );
}

export default Collumn;
