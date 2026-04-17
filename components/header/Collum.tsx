import type { Column, NavItem } from "../../loaders/menu.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { clx } from "../../utils/clx.ts";
import { TEXT_COLORS } from "../../utils/constants.tsx";
import Icon from "../ui/Icon.tsx";

const Item = ({ title, link, isBlank }: NavItem) => {
  return (
    <li class="w-full md:border-b border-base-200">
      <div data-gtm-block-name="navigation-menu">
        <a
          class={clx(
            "flex items-center justify-start w-full text-sm font-light h-[42px]",
            "max-md:h-[34px]",
          )}
          href={link}
          target={isBlank ? "_blank" : "_self"}
          rel={isBlank ? "noopener noreferrer" : ""}
          data-gtm-element="menu-link"
          data-gtm-value={title}
        >
          <p>{title}</p>
        </a>
      </div>
    </li>
  );
};

function Column(
  { categories, sendToDatalayer }: Column & { sendToDatalayer?: boolean },
) {
  return (
    <li class="w-full">
      <ul class="flex flex-col px-2 sm:w-52 gap-2 sm:gap-4">
        {categories.map((category) => {
          const event = sendToDatalayer
            ? useSendEvent({
              on: "click",
              event: {
                name: "navigation" as const,
                params: {
                  menu_location: "menu_header",
                  menu_button: category.title,
                },
              },
            })
            : undefined;
          return (
            <li class="flex flex-col w-full">
              <div data-gtm-block-name="navigation-menu">
                <a
                  href={category.link}
                  target={category?.isBlank ? "_blank" : "_self"}
                  rel={category?.isBlank ? "noopener noreferrer" : ""}
                  class={clx(
                    "flex items-center gap-2 font-semibold text-base h-[56px]",
                    "max-md:text-[18px] max-md:h-9",
                  )}
                  {...event}
                  data-gtm-element="menu-link"
                  data-gtm-value={category.title}
                >
                  {category?.icon && (
                    <Icon class="text-primary" id={category.icon} />
                  )}
                  <p
                    class={category.titleColor &&
                      TEXT_COLORS[category.titleColor]}
                  >
                    {category.title}
                  </p>
                </a>
                <ul>
                  {category.navItems.map((item) => <Item {...item} />)}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export default Column;
