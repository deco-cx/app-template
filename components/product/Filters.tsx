import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { clx } from "../../utils/clx.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { VNode } from "preact";

interface Props {
  filters: ProductListingPage["filters"];
  siteTemplate: "elux" | "frigidaire";
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem(
  { selected, label, siteTemplate, url, quantity }: FilterToggleValue & {
    siteTemplate: "elux" | "frigidaire";
  },
) {
  return (
    <li class="flex items-center gap-2">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={selected}
          class={clx(
            "w-4 h-4 appearance-none border rounded-sm cursor-pointer flex justify-center [&:checked::before]:self-center",
            siteTemplate === "elux"
              ? "checked:bg-white border-warning [&:checked::before]:content-[url('https://deco-sites-assets.s3.sa-east-1.amazonaws.com/elux-latam/53221bfd-3f69-4050-9677-6c6d4d767c50/check.png')] [&:checked::before]:-mt-[2px]"
              : "checked:border-none checked:bg-primary border-neutral [&:checked::before]:content-[url('https://deco-sites-assets.s3.sa-east-1.amazonaws.com/elux-nola-us/453ebc96-5d1f-403a-a5c6-92f48dd206c0/check.png')]",
          )}
          hx-on:click={`window.location.href = "${url}"`}
        />
        <span class="text-sm">{label} {quantity > 0 && `(${quantity})`}</span>
      </label>
    </li>
  );
}

function Filters({ filters, siteTemplate }: Props) {
  return (
    <>
      <div class="w-full flex flex-col gap-5">
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    input:checked ~ label .arrow { transform: rotate(270deg); transition: transform 0.4s ease; }
                    input:not(:checked) ~ label .arrow { transform: rotate(90deg); transition: transform 0.4s ease; }
                    `,
          }}
        />
        <ul class="flex flex-col gap-5 p-0">
          {filters
            .filter(isToggle)
            .map((filter) => (
              <li class="flex flex-col gap-4 border-b border-base-200 last:border-b-0">
                <CollapseFilters {...filter} siteTemplate={siteTemplate} />
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

function CollapseFilters(
  props: FilterToggle & { siteTemplate: "elux" | "frigidaire" },
) {
  const id = useId();
  const { items, hasChecked } = props.values.reduce((acc, item) => {
    return {
      items: [
        ...acc.items,
        <ValueItem
          {...item}
          siteTemplate={props.siteTemplate}
        />,
      ],
      hasChecked: acc.hasChecked || item.selected,
    };
  }, { items: [] as VNode[], hasChecked: false });

  return (
    <div class="collapse collapse-plus rounded-none">
      <input class="hidden peer" type="checkbox" id={id} checked={hasChecked} />

      <label htmlFor={id} class="pb-2 peer-checked:pb-0 cursor-pointer">
        <div class="collapse-title min-h-0 p-0">
          <div
            class={clx(
              "flex items-center justify-between h-full w-full",
            )}
          >
            <p class="font-normal">{props.label}</p>
            <Icon
              id="chevron-right"
              class="ml-auto text-primary arrow pointer-events-none rotate-90"
              stroke="#19191a"
            />
          </div>
        </div>
      </label>

      <div class="collapse-content !p-0 font-light">
        <ul class="flex flex-col gap-2 py-2">
          {items}
        </ul>
      </div>
    </div>
  );
}

export default Filters;
