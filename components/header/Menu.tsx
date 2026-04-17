import Icon from "../../components/ui/Icon.tsx";
import {
  HEADER_HEIGHT_DESKTOP_NO_SECONDARY,
  NAVBAR_HEIGHT_DESKTOP,
  TEXT_COLORS,
} from "../../utils/constants.tsx";
import type { ExtraMenu, Menu as MenuProps } from "../../loaders/menu.ts";
import { clx } from "../../utils/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useRadio } from "../../sdk/useRadio.tsx";
import Column from "./Collum.tsx";
import Image from "apps/website/components/Image.tsx";
import { useScript } from "@deco/deco/hooks";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
const ExtraLink = ({ title, links, isLast }: ExtraMenu & {
  isLast: boolean;
}) => {
  return (
    <div class={clx(!isLast && "border-b border-base-200")}>
      <p class="flex items-center h-9 text-base font-semibold text-primary">
        {title}
      </p>
      <ul>
        {links.map(({ link, isBlank, title, icon }) => (
          <li>
            <a
              class={clx(
                "text-base font-normal leading-none h-[54px] flex justify-between items-center text-secondary",
              )}
              href={link}
              target={isBlank ? "_blank" : "_self"}
              rel={isBlank ? "noopener noreferrer" : ""}
            >
              <span class="flex items-center gap-2">
                {icon && <Icon class="text-primary" id={icon} />}
                <p class="h-full font-semibold">{title}</p>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
const MenuMobile = (
  { links, extraLinks, mobile, menuText, event }: MenuProps & {
    event?: { type: "navigation" | "filter" };
  },
) => {
  const hasEvent = !!event;
  return (
    <>
      <aside
        class={clx(
          "-translate-x-full group-has-[#open-menu:checked]/header:translate-x-0 transition-all",
          "z-50 w-screen h-screen top-0 overflow-y-auto fixed",
        )}
      >
        <div class="h-[52px] bg-primary w-full p-2 flex items-center justify-between pl-4">
          <Image
            src={mobile.logo}
            width={mobile.logoWidth ?? 140}
            height={mobile.logoHeight ?? 32}
          />
          <label
            class="h-9 w-9 flex items-center justify-center"
            htmlFor={"open-menu"}
          >
            <Icon id="close" class="text-white" />
          </label>
        </div>
        <div class="flex flex-col gap-3.5 h-full w-full bg-white pt-2 px-4">
          <div class="border-b border-base-200">
            <p class="flex items-center h-9 text-base font-semibold text-primary">
              {menuText}
            </p>
            <ul class="w-full h-full rounded-b-[4px]">
              {links.map(({ title, icon, color, link, isBlank, collums }) => {
                const id = useId();
                const hasAside = collums && collums.length > 0;
                const onClick = (id: string) => {
                  const input = document.getElementById(id) as HTMLInputElement;
                  input.checked = !input.checked;
                };
                const onClickEvent = hasAside
                  ? { "hx-on:click": useScript(onClick, id) }
                  : {};
                let datalayerEvent = {};

                if (hasEvent) {
                  datalayerEvent = event.type === "navigation"
                    ? useSendEvent({
                      on: "click",
                      event: {
                        name: "navigation" as const,
                        params: {
                          menu_location: "menu_header",
                          menu_button: title,
                        },
                      },
                    })
                    : useSendEvent({
                      on: "click",
                      event: {
                        name: "apply_filter",
                        params: {
                          filter_option: id,
                        },
                      },
                    });
                }

                return (
                  <li class="group">
                    <input type="checkbox" class="hidden peer" id={id} />
                    <div
                      class={clx(
                        "text-base font-normal leading-none h-[54px] flex flex-row items-center peer-checked:bg-base-200",
                      )}
                      style={{ color: color }}
                      data-gtm-block-name="navigation-menu"
                    >
                      <span class="flex items-center gap-2 h-full">
                        {icon && <Icon class="text-primary" id={icon} />}
                        <a
                          href={link}
                          target={isBlank ? "_blank" : "_self"}
                          rel={isBlank ? "noopener noreferrer" : ""}
                          class="h-full font-semibold items-center flex text-secondary w-max"
                          {...datalayerEvent}
                          data-gtm-element="menu-link"
                          data-gtm-value={title}
                        >
                          {title}
                        </a>
                      </span>
                      <p
                        {...onClickEvent}
                        class="w-full h-full content-center"
                        style={{ placeItems: "self-end" }}
                      >
                        <Icon class="text-primary" id="chevron-right" />
                      </p>
                    </div>
                    {hasAside && (
                      <aside
                        class={clx(
                          "-translate-x-full peer-checked:translate-x-0 transition-all",
                          "z-50 w-screen h-screen absolute top-0 left-0 bg-white text-secondary",
                        )}
                      >
                        <div class="h-[52px] bg-primary w-full p-2 flex items-center justify-between pl-4">
                          <Image
                            src={mobile.logo}
                            width={mobile.logoWidth ?? 140}
                            height={mobile.logoHeight ?? 32}
                          />
                          <label
                            htmlFor={id}
                            class="h-9 flex gap-2 items-center justify-between"
                          >
                            <Icon
                              id="chevron-right"
                              class="text-white rotate-180"
                            />
                            <p class="text-white text-sm font-semibold">
                              {mobile.textGoBack}
                            </p>
                          </label>
                        </div>
                        <ul class="flex flex-col items-start justify-start pt-2 px-4 gap-2 h-full overflow-scroll max-h-[calc(100vh_-_52px)]">
                          {collums.map((column) => <Column {...column} />)}
                        </ul>
                      </aside>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          {extraLinks?.map((props, index, array) => (
            <ExtraLink {...props} isLast={index === (array.length - 1)} />
          ))}
        </div>
      </aside>
    </>
  );
};
function Menu({ links, menuText, hideSecondaryMenu }: MenuProps) {
  const { Radio } = useRadio("menu-desk");
  return (
    <>
      <div
        class={clx(
          "opacity-0 group-has-[#open-menu:checked]/header:opacity-100",
          "group-has-[#open-menu:checked]/header:pointer-events-auto pointer-events-none left-3 absolute z-50",
        )}
        style={{
          top: !hideSecondaryMenu
            ? NAVBAR_HEIGHT_DESKTOP
            : HEADER_HEIGHT_DESKTOP_NO_SECONDARY,
        }}
      >
        <div class="flex flex-col gap-2 bg-white w-[296px] h-[568px] rounded-b-[4px] py-6 px-8 relative">
          <p class="flex items-center h-9 text-base font-semibold text-primary">
            {menuText}
          </p>
          <ul>
            {links.map(({ title, icon, color, link, isBlank, collums }) => {
              const id = useId();
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
                  class="group"
                  hx-on:mouseenter={useScript((id: string) => {
                    const input = document.getElementById(
                      id,
                    ) as HTMLInputElement;
                    input.checked = true;
                  }, id)}
                >
                  <div data-gtm-block-name="navigation-menu">
                    <Radio id={id} />
                    <a
                      {...event}
                      data-gtm-element="menu-link"
                      data-gtm-value={title}
                      class={clx(
                        "text-base font-normal leading-none min-h-[54px] p-2 flex justify-between items-center peer-checked:bg-base-200 border-b border-base-200",
                        color && TEXT_COLORS[color],
                      )}
                      href={link}
                      target={isBlank ? "_blank" : "_self"}
                      rel={isBlank ? "noopener noreferrer" : ""}
                    >
                      <span class="flex items-center gap-2">
                        {icon && <Icon class="text-primary" id={icon} />}
                        <p>{title}</p>
                      </span>
                      <p>
                        <Icon class="text-primary" id="chevron-right" />
                      </p>
                    </a>
                    {collums && collums.length > 0 && (
                      <div class="absolute hidden hover:flex peer-checked:flex bg-base-100 z-40 items-start justify-start flex-col gap-2 p-6 top-0 left-[295px] h-full">
                        <a
                          href={link}
                          target={isBlank ? "_blank" : "_self"}
                          rel={isBlank ? "noopener noreferrer" : ""}
                          class="flex items-center px-2 text-base font-semibold"
                        >
                          {title}
                        </a>
                        <ul class="flex items-start justify-start h-full">
                          {collums.map((column) => <Column {...column} />)}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div
        class={clx(
          "h-screen w-screen fixed",
          "group-has-[#open-menu:checked]/header:pointer-events-auto pointer-events-none ",
          hideSecondaryMenu && "mt-5.5",
        )}
        style={{ left: 0 }}
      >
        <div
          class={clx(
            "z-40 group-has-[#open-menu:checked]/header:opacity-50 group-has-[.hover-nav-item:hover]/header:opacity-50 opacity-0 transition-opacity bg-black h-full w-full relative",
          )}
        />
      </div>
    </>
  );
}
Menu.Mobile = MenuMobile;
export default Menu;
