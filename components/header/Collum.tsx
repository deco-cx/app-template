import type { Column, NavItem } from "../../loaders/menu.ts";
import { clx } from "../../utils/clx.ts";
import { TEXT_COLORS } from "../../utils/constants.tsx";
import Icon from "../ui/Icon.tsx";

const Item = ({ title, link, isBlank }: NavItem) => {
  return (
    <li class="w-full md:border-b border-base-200">
      <a
        class={clx(
          "flex items-center justify-start w-full text-sm font-normal h-[42px]",
          "max-md:h-[34px]",
        )}
        href={link}
        target={isBlank ? "_blank" : "_self"}
        rel={isBlank ? "noopener noreferrer" : ""}
      >
        <p>{title}</p>
      </a>
    </li>
  );
};

function Column({ categories }: Column) {
  return (
    <li class="w-full">
      <ul class="flex flex-col px-2 sm:w-52 gap-2 sm:gap-4">
        {categories.map((category) => (
          <li class="flex flex-col w-full">
            <a
              href={category.link}
              target={category?.isBlank ? "_blank" : "_self"}
              rel={category?.isBlank ? "noopener noreferrer" : ""}
              class={clx(
                "flex items-center gap-2 font-bold text-base h-[56px]",
                "max-md:text-[18px] max-md:h-9",
              )}
            >
              {category?.icon && (
                <Icon class="text-primary" id={category.icon} />
              )}
              <p
                class={category.titleColor && TEXT_COLORS[category.titleColor]}
              >
                {category.title}
              </p>
            </a>
            <ul>
              {category.navItems.map((item) => <Item {...item} />)}
            </ul>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default Column;
