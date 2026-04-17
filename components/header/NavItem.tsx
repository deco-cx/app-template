import { NAVBAR_HEIGHT_DESKTOP } from "../../utils/constants.tsx";
import type { Department } from "../../loaders/menu.ts";
import { clx } from "../../utils/clx.ts";
import Column from "./Collum.tsx";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
function NavItem(
  { title, collums, link, isBlank, color, siteTemplate }: Department & {
    siteTemplate?: "elux" | "frigidaire";
  },
) {
  const hasContentDiv = collums && collums.length > 0;
  const event = useSendEvent({
    on: "click",
    event: {
      name: "navigation" as const,
      params: {
        menu_location: "menu_header",
        menu_button: title,
      },
    },
  });
  return (
    <li
      class={clx(
        "group flex items-center justify-center h-full relative",
        siteTemplate === "elux" ? "px-6" : "teste",
        hasContentDiv ? "hover-nav-item" : "",
        "group-has-[#open-menu:checked]/header:pointer-events-none",
      )}
    >
      <div data-gtm-block-name="navigation-menu">
        <a
          href={link}
          {...event}
          class={clx(
            "text-base font-normal leading-none h-7 flex items-center",
          )}
          style={{ color: color }}
          target={isBlank ? "_blank" : "_self"}
          rel={isBlank ? "noopener noreferrer" : ""}
          data-gtm-element="menu-link"
          data-gtm-value={title}
        >
          <p class="leading-none text-secondary font-medium text-sm">{title}</p>
        </a>
      </div>

      {hasContentDiv && (
        <div
          class="absolute hidden hover:flex group-hover:flex bg-white z-40 items-start justify-start gap-6 top-0 left-0"
          style={{ marginTop: NAVBAR_HEIGHT_DESKTOP }}
        >
          <ul class="flex items-start justify-start p-6 gap-4">
            {collums.map((column) => (
              <Column {...column} sendToDatalayer={true} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default NavItem;
