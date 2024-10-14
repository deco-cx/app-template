import { ExtraMenu } from "../../loaders/menu.ts";
import { clx } from "../../utils/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
function Dropdown({ icon, title, links }: ExtraMenu) {
  const id = useId();
  const setup = (id: string) => {
    const dropdown = document.getElementById(id) as HTMLUListElement;
    const elementWidth = dropdown.offsetWidth;
    dropdown.style.left = `calc(100% - ${elementWidth}px)`;
  };
  return (
    <div class="dropdown dropdown-hover group">
      <div
        tabIndex={0}
        role="button"
        class="flex justify-between items-center h-[38px]"
      >
        <div class="flex items-center gap-2">
          {icon && <Icon id={icon} />}
          <p class="text-sm font-semibold">{title}</p>
        </div>
        <Icon
          class="text-primary rotate-90 group-hover:-rotate-90 duration-150 ease-in-out"
          id="chevron-right"
        />
      </div>
      <ul
        tabIndex={0}
        class={clx(
          "dropdown-content w-min !py-2 bg-white z-[9999]",
          "rounded-[1px] border border-base-200 group",
        )}
        id={id}
        style={{
          boxShadow: "0px 2px 4px 0px #56697326",
        }}
      >
        {links.map(({ link, title, icon, isBlank }) => (
          <li class="w-full hover:bg-base-200 !px-4">
            <a
              class="min-w-max flex items-center w-max h-[38px] hover:!bg-transparent font-semibold text-sm gap-2.5"
              href={link}
              target={isBlank ? "_blank" : "_self"}
              rel={isBlank ? "noopener noreferrer" : ""}
            >
              {icon && <Icon id={icon} size={24} />}
              <p>{title}</p>
            </a>
          </li>
        ))}
      </ul>
      <script dangerouslySetInnerHTML={{ __html: useScript(setup, id) }} />
    </div>
  );
}
export default Dropdown;
