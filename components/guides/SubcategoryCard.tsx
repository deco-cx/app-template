import { CategoryChild } from "../../loaders/guides/categories.ts";
import { clx } from "../../utils/clx.ts";
import Icon from "../ui/Icon.tsx";

interface Props {
  subcategory: CategoryChild;
  siteTemplate: "elux" | "frigidaire";
}

export default function SubcategoryCard({ subcategory, siteTemplate }: Props) {
  const styling = siteTemplate === "frigidaire"
    ? FRIGIDAIRE_STYLING
    : ELUX_STYLING;
  return (
    <a
      class={clx(
        "w-full h-[132px] flex flex-col gap-4 px-3.5 justify-center items-center",
        styling.border,
      )}
      href={subcategory.url}
    >
      {subcategory.icon && (
        <Icon
          id={subcategory.icon}
          class={styling.icon}
          width={40}
          height={40}
        />
      )}
      <p class={styling.title}>{subcategory.name}</p>
    </a>
  );
}

const ELUX_STYLING = {
  border: "border border-[#DEE7EA]",
  icon: "text-primary",
  title: "text-sm text-secondary font-light text-center line-clamp-3",
};

const FRIGIDAIRE_STYLING = {
  border: "border border-neutral",
  icon: "text-secondary",
  title: "text-sm text-secondary font-light text-center line-clamp-3",
};
