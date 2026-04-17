import { CategoryCard as CategoryCardType } from "../../sections/Content/CategoryCards.tsx";
import Icon from "./Icon.tsx";

type Props = CategoryCardType;

export default function CategoryCard({ title, icon, url }: Props) {
  return (
    <a
      href={url ?? "#"}
      class="flex flex-col gap-2 h-20 w-20 md:h-[116px] md:w-[116px] pt-1 md:pt-5 bg-white rounded-sm border border-base-200 items-center px-1"
      data-gtm-element="our-products-link"
      data-gtm-value={title}
    >
      <Icon id={icon} height={24} width={24} />
      <div class="text-[11px] leading-[14px] md:leading-[19.2px] text-center font-light w-full">
        <p class="overflow-hidden text-ellipsis">{title}</p>
      </div>
    </a>
  );
}
