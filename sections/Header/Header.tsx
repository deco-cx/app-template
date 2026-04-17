import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../../components/ui/Icon.tsx";
import {
  BG_COLORS,
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_DESKTOP_NO_SECONDARY,
  HEADER_HEIGHT_MOBILE,
} from "../../utils/constants.tsx";
import { useDevice } from "@deco/deco/hooks";
import { Menu as MenuProps } from "../../loaders/menu.ts";
import Dropdown from "../../components/header/Dropdown.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Menu from "../../components/header/Menu.tsx";
import TopNotification, {
  TOP_NOTIFICATION_HEIGHT,
  type TopNotificationProps,
} from "../../components/header/TopNotification.tsx";
import { Colors } from "../../utils/types.ts";
import { clx } from "../../utils/clx.ts";
import { AppContext } from "../../mod.ts";
export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
export interface SectionProps {
  /** @title Logo */
  logo: Logo;
  menu: MenuProps;
  /**
   * @title Notificação superior
   * @description Barra opcional exibida acima do menu/logotipo.
   */
  topNotification?: TopNotificationProps;
  backgroundColor?: Colors;
}

export const loader = (props: SectionProps, _req: Request, ctx: AppContext) => {
  return {
    ...props,
    siteTemplate: ctx.siteTemplate,
  };
};

type Props = SectionProps;
const Desktop = ({ logo, menu, siteTemplate }: ReturnType<typeof loader>) => {
  const hideSecondaryMenu = menu.hideSecondaryMenu;
  return (
    <>
      <div class={clx("flex flex-col gap-4 max-w-[1280px] mx-auto h-[70px]")}>
        <div
          class="flex justify-between items-center h-full px-13.5 text-secondary"
          data-gtm-block-name="navigation-menu"
        >
          <a
            href="/"
            aria-label="Store logo"
            data-gtm-element="menu-link"
            data-gtm-value="Store logo"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
          <div class="flex justify-start items-center gap-6">
            {hideSecondaryMenu && (
              <div>
                <label
                  htmlFor="open-menu"
                  class="cursor-pointer text-white text-sm flex flex-row font-medium items-center"
                >
                  <p>{menu.allCategoriesText}</p>{" "}
                  <Icon
                    class={clx(
                      "rotate-90 group-has-[#open-menu:checked]/header:-rotate-90 duration-150 ease-in-out",
                      "text-white",
                    )}
                    id="chevron-right"
                  />
                </label>
                <Menu {...menu} />
              </div>
            )}
            {menu.extraLinks?.map((props) => <Dropdown {...props} />)}
            {!menu.languages.hide && <Dropdown {...menu.languages} />}
          </div>
        </div>
      </div>
      {!hideSecondaryMenu && (
        <div class="bg-base-200 h-[72px] shadow-[0px_1px_4px_0px_#56697326]">
          <ul
            class={clx(
              "flex h-full max-w-[1280px] mx-auto text-sm text-secondary font-medium",
              siteTemplate === "elux" ? "justify-start" : "justify-between",
            )}
          >
            <li class="relative w-[182px] mr-6">
              <label
                htmlFor="open-menu"
                class="flex items-center justify-center h-full w-[182px] gap-2 cursor-pointer"
              >
                <Icon class="text-primary" id="menu" />
                <p>{menu.allCategoriesText}</p>
              </label>
              <Menu {...menu} />
            </li>
            {menu.links.map((props) => <NavItem {...props} siteTemplate={siteTemplate} />)}
          </ul>
        </div>
      )}
      <input id="open-menu" type="checkbox" class="hidden" />
    </>
  );
};
const Mobile = ({ logo, menu }: Props) => (
  <>
    <div style={{ boxShadow: "0px 2px 4px 0px #56697326" }}>
      <div class="container flex items-center justify-between px-4 py-2">
        <div
          class={clx(
            "flex items-center gap-2",
            menu.languages.hide && "w-full",
          )}
          data-gtm-block-name="navigation-menu"
        >
          <label
            for={"open-menu"}
            class="flex items-center justify-center rounded-[4px] bg-primary w-[48px] h-[48px]"
            aria-label="open menu"
          >
            <Icon class="text-white" id="menu" />
          </label>

          {logo && (
            <a
              href="/"
              class="flex-grow inline-flex items-center justify-center"
              aria-label="Store logo"
              data-gtm-element="menu-link"
              data-gtm-value="Store logo"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 100}
                height={logo.height || 13}
              />
            </a>
          )}
          {menu.languages.hide && <div class="w-12 h-12" />}
        </div>
        {!menu.languages.hide && <Dropdown {...menu.languages} />}
      </div>
    </div>
    <Menu.Mobile {...menu} event={{ type: "navigation" }} />
    <input id="open-menu" type="checkbox" class="hidden" />
  </>
);
function Header({
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  backgroundColor,
  ...props
}: ReturnType<typeof loader>) {
  const device = useDevice();
  const hideSecondaryMenu = props.menu.hideSecondaryMenu;
  const topNotification = props.topNotification;
  const hasTopNotification = !!topNotification?.active
    && topNotification.items?.length > 0;
  const closeId = "header-top-notification-close";

  const baseHeaderHeight = device === "desktop"
    ? hideSecondaryMenu
      ? HEADER_HEIGHT_DESKTOP_NO_SECONDARY
      : HEADER_HEIGHT_DESKTOP
    : HEADER_HEIGHT_MOBILE;

  return (
    <>
      {hasTopNotification && (
        <>
          <input id={closeId} type="checkbox" class="peer hidden" />
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .top-notification {
                  display: none;
                }

                #${closeId}[data-ready="true"]:not(:checked) ~ .top-notification {
                  display: block;
                }

                #${closeId}[data-ready="true"]:not(:checked) ~ header {
                  height: calc(${baseHeaderHeight} + ${TOP_NOTIFICATION_HEIGHT});
                }

                #${closeId}[data-ready="true"]:not(:checked) ~ header .header-fixed {
                  top: ${TOP_NOTIFICATION_HEIGHT};
                }
              `,
            }}
          />
          {topNotification && (
            <div class="top-notification">
              <TopNotification {...topNotification} closeId={closeId} />
            </div>
          )}
        </>
      )}
      <header style={{ height: baseHeaderHeight }}>
        <div
          class={clx(
            "group/header bg-base-100 fixed w-full z-40 header-fixed",
            "top-0",
            BG_COLORS[backgroundColor ?? "white"],
            props.siteTemplate === "elux" &&
            "md:shadow-[0px_1px_3px_0px_#00000033]",
          )}
        >
          {device === "desktop"
            ? <Desktop logo={logo} {...props} />
            : <Mobile logo={logo} {...props} />}
        </div>
      </header>
    </>
  );
}

export default Header;
