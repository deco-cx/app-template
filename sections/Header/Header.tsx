import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../../components/ui/Icon.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
} from "../../utils/constants.tsx";
import { useDevice } from "@deco/deco/hooks";
import { Menu as MenuProps } from "../../loaders/menu.ts";
import Dropdown from "../../components/header/Dropdown.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Menu from "../../components/header/Menu.tsx";
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
}

type Props = Omit<SectionProps, "alert">;
const Desktop = ({ logo, menu }: Props) => {
  return (
    <>
      <div class="flex flex-col gap-4  max-w-[1280px] mx-auto h-[70px]">
        <div class="flex justify-between items-center h-full px-13.5 text-secondary">
          <a href="/" aria-label="Store logo">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
          <div class="flex justify-start items-center gap-6">
            {menu.extraLinks?.map((props) => <Dropdown {...props} />)}
            <Dropdown {...menu.languages} />
          </div>
        </div>
      </div>
      <div class="bg-base-200 h-[72px]">
        <ul class="flex justify-start h-full max-w-[1280px] mx-auto text-sm text-secondary font-semibold">
          <li class="relative w-[182px]">
            <label
              htmlFor="open-menu"
              class="flex items-center justify-center h-full w-[182px] gap-2 cursor-pointer"
            >
              <Icon class="text-primary" id="menu" />
              <p>{menu.allCategoriesText}</p>
            </label>
            <Menu {...menu} />
          </li>
          {menu.links.map((props) => <NavItem {...props} />)}
        </ul>
      </div>
      <input id="open-menu" type="checkbox" class="hidden" />
    </>
  );
};
const Mobile = ({ logo, menu }: Props) => (
  <>
    <div style={{ boxShadow: "0px 2px 4px 0px #56697326" }}>
      <div class="container flex items-center justify-between px-4 py-2">
        <div class="flex items-center gap-2">
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
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 100}
                height={logo.height || 13}
              />
            </a>
          )}
        </div>
        <Dropdown {...menu.languages} />
      </div>
    </div>
    <Menu.Mobile {...menu} />
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
  ...props
}: Props) {
  const device = useDevice();
  return (
    <header
      style={{
        height: device === "desktop"
          ? HEADER_HEIGHT_DESKTOP
          : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class="group/header bg-base-100 fixed w-full z-40">
        {device === "desktop"
          ? <Desktop logo={logo} {...props} />
          : <Mobile logo={logo} {...props} />}
      </div>
    </header>
  );
}

export default Header;
