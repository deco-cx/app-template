import { FilterToggle, FilterToggleValue } from "apps/commerce/types.ts";
import { clx } from "../../utils/clx.ts";
import Icon from "../ui/Icon.tsx";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import { LANGUAGE_DIFFS } from "../../utils/constants.tsx";
import ApplicableFilters from "../ui/ApplicableFilters.tsx";

interface MenuProps {
  filters: FilterToggle[];
  language: "EN" | "ES";
  siteTemplate: "elux" | "frigidaire";
}

const onClick = (id: string) => {
  const input = document.getElementById(
    id,
  ) as HTMLInputElement;
  input.checked = !input.checked;
};

export function MenuMobile(
  { filters, language, siteTemplate }: MenuProps,
) {
  const [menuItems, titleColor] = siteTemplate === "frigidaire"
    ? [FrigidareMenuItems({ filters, language }), "text-secondary"]
    : [EluxMenuItems({ filters }), "text-neutral-content"];
  const id = useId();
  return (
    <div
      class={clx(
        "fixed inset-0 z-50",
        "opacity-0 invisible",
        "group-has-[#open-filters:checked]:visible group-has-[#open-filters:checked]:opacity-100",
        "transition-opacity duration-150",
        "bg-black/60",
      )}
    >
      <aside
        class={clx(
          "translate-x-full group-has-[#open-filters:checked]:-translate-x-0",
          "transition-transform duration-150",
          "group-has-[#open-filters:checked]:delay-150",
          "w-screen h-screen top-0 overflow-y-auto overflow-x-hidden fixed",
        )}
      >
        <ApplicableFilters
          class="w-[90%] h-[100dvh] float-right bg-white !opacity-100 flex flex-col justify-between"
          id={id}
        >
          {/** Header */}
          <div class="h-[44px] bg-white w-full pt-2 px-2 flex flex-row items-center justify-between pl-4">
            <span
              class={clx(
                titleColor,
                "font-semibold",
              )}
            >
              {LANGUAGE_DIFFS[language].listingPage.filter}
            </span>
            <label
              class="h-9 w-9 flex items-center justify-center"
              htmlFor={"open-filters"}
            >
              <Icon id="close" class="text-primary" />
            </label>
          </div>
          {/** Menu Items */}
          <div class="flex flex-col gap-3.5 h-full w-full bg-white pt-2 px-4 text-secondary overflow-y-auto">
            <div>
              {menuItems}
            </div>
          </div>
          {/** Footer */}
          <FilterButtons
            language={language}
            siteTemplate={siteTemplate}
          />
        </ApplicableFilters>
        <ApplicableFilters.JS rootId={id} />
      </aside>
    </div>
  );
}

const FrigidareMenuItems = (
  { filters, language }: { filters: FilterToggle[]; language: "EN" | "ES" },
) => {
  return (
    <ul class="w-full h-full">
      {filters.map((filter) => {
        const id = useId();
        const onClickEvent = {
          "hx-on:click": useScript(
            onClick,
            id,
          ),
        };

        return (
          <li class="group border-b border-base-200 first:border-t">
            <input
              type="checkbox"
              class="hidden peer"
              id={id}
            />
            <div
              class={clx(
                "text-base font-normal leading-none h-[54px] flex justify-between items-center",
              )}
              {...onClickEvent}
            >
              <div class="text-neutral-content flex flex-row gap-1 items-center">
                <span>{filter.label}</span>
                <ApplicableFilters.Counter
                  categoryKey={filter.key}
                  class="w-7 h-6 min-w-7 min-h-6 rounded-[100px] bg-primary text-white text-xs flex items-center justify-center font-medium"
                />
              </div>
              <p>
                <Icon
                  class="text-primary"
                  id="chevron-right"
                />
              </p>
            </div>
            <SubmenuAside
              id={id}
              {...filter}
              language={language}
            />
          </li>
        );
      })}
    </ul>
  );
};

const EluxMenuItems = (
  { filters }: { filters: FilterToggle[] },
) => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
                    input:checked ~ label .arrow { transform: rotate(270deg); transition: transform 0.4s ease; }
                    input:not(:checked) ~ label .arrow { transform: rotate(90deg); transition: transform 0.4s ease; }
                    `,
        }}
      />
      <ul class="w-full h-full flex flex-col gap-3.5">
        {filters.map((filter) => {
          const id = useId();
          return (
            <li class="group border-b border-base-200 first:border-t first:pt-3.5">
              <div class="collapse collapse-plus rounded-none">
                <input
                  class="hidden peer"
                  type="checkbox"
                  id={id}
                />

                <label
                  htmlFor={id}
                  class="pb-3.5 peer-checked:pb-0"
                >
                  <div class="collapse-title min-h-0 p-0">
                    <div
                      class={clx(
                        "flex items-center justify-between h-full w-full",
                      )}
                    >
                      <div class="font-light flex flex-row gap-1 items-center">
                        <span>{filter.label}</span>
                        <ApplicableFilters.Counter
                          categoryKey={filter.key}
                          class="w-7 h-6 min-w-7 min-h-6 rounded-[100px] bg-primary text-white text-xs flex items-center justify-center font-medium"
                        />
                        <ApplicableFilters.ClearBtn
                          specificCategoryKey={filter.key}
                          rel="next"
                          class={clx(
                            "btn btn-ghost px-4 [.hidden~&]:hidden",
                            "px-4 min-h-6 max-h-6 bg-primary text-white rounded font-medium text-xs",
                          )}
                        >
                          {LANGUAGE_DIFFS["ES"].listingPage.clear}
                        </ApplicableFilters.ClearBtn>
                      </div>
                      <Icon
                        id="chevron-right"
                        class="ml-auto text-primary arrow pointer-events-none rotate-90"
                        stroke="#19191a"
                      />
                    </div>
                    <ApplicableFilters.List
                      categoryKey={filter.key}
                      class="text-xs text-primary font-light mt-1"
                    />
                  </div>
                </label>

                <div class="collapse-content !p-0">
                  <ul class="flex flex-col">
                    {filter.values.map(
                      ({ label, value, selected, quantity }) => {
                        return (
                          <li class="h-[54px] flex items-center w-full border-t border-base-200 ml-4 first:mt-2 first:ml-0 first:pl-4">
                            <label class="flex items-center gap-1 cursor-pointer w-full">
                              <ApplicableFilters.Input
                                categoryKey={filter.key}
                                filterValue={value}
                                checked={selected}
                                class={clx(
                                  "w-4 h-4 appearance-none border rounded-sm cursor-pointer flex justify-center [&:checked::before]:self-center",
                                  "checked:bg-white border-warning [&:checked::before]:content-[url('https://deco-sites-assets.s3.sa-east-1.amazonaws.com/elux-latam/53221bfd-3f69-4050-9677-6c6d4d767c50/check.png')] [&:checked::before]:-mt-[2px]",
                                )}
                              />
                              <span class="text-base">
                                {label}
                              </span>
                              <span class="text-base">
                                {quantity > 0 && `(${quantity})`}
                              </span>
                            </label>
                          </li>
                        );
                      },
                    )}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const SubmenuAside = (
  { id, label, values, language, key }: {
    id: string;
    label: string;
    values: FilterToggleValue[];
    key: string;
    language: "EN" | "ES";
  },
) => {
  return (
    <aside
      class={clx(
        "translate-x-full peer-checked:-translate-x-0 transition-all",
        "z-50 w-[90%] h-[100dvh] absolute top-0 right-0 bg-white text-secondary flex flex-col",
      )}
    >
      <div class="flex flex-col justify-between h-full">
        <div class="h-[44px] bg-white w-full pt-2 px-2 flex flex-row items-center justify-between pl-4">
          <div class="font-normal text-info flex flex-row gap-1.5 items-center">
            <label htmlFor={id}>
              {LANGUAGE_DIFFS[language].listingPage.filter}
            </label>
            <Icon
              id="chevron-right"
              class="text-primary"
            />
            <span class="text-secondary font-medium">{label}</span>
          </div>

          {
            /* <label
            htmlFor={id}
            class="h-9 flex gap-2 items-center justify-between"
          >
            <Icon
              id="chevron-right"
              class="text-primary rotate-180"
            />
          </label> */
          }
        </div>
        <ul class="flex flex-col items-start justify-start pt-2 px-4 gap-2 h-full overflow-scroll max-h-[calc(100vh_-_52px)]">
          {values.map(({ label, value, selected, quantity }) => (
            <li class="group border-b border-base-200 first:border-t w-full">
              <div class="flex items-center gap-2 text-base font-normal leading-none h-[54px] justify-between">
                <label class="flex items-center gap-2 cursor-pointer w-full">
                  <ApplicableFilters.Input
                    categoryKey={key}
                    filterValue={value}
                    checked={selected}
                    class={clx(
                      "w-4 h-4 border-neutral appearance-none border checked:border-none rounded-sm cursor-pointer checked:bg-primary flex justify-center",
                      "[&:checked::before]:content-[url('https://deco-sites-assets.s3.sa-east-1.amazonaws.com/elux-nola-us/453ebc96-5d1f-403a-a5c6-92f48dd206c0/check.png')]",
                      "[&:checked::before]:-mt-[1px]",
                    )}
                  />
                  <span class="text-base font-light">
                    {label}
                  </span>
                </label>
                <span class="text-base font-light">
                  {quantity > 0 && `(${quantity})`}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <FilterButtons
          language={language}
          siteTemplate="frigidaire"
          categoryKey={key}
        />
      </div>
    </aside>
  );
};

const FilterButtons = ({
  language,
  siteTemplate,
  categoryKey,
}: {
  language: "EN" | "ES";
  siteTemplate: "elux" | "frigidaire";
  categoryKey?: string;
}) => {
  return (
    <div class="pt-2 pb-3.5 grid grid-cols-2 gap-1.5 px-4">
      <ApplicableFilters.ClearBtn
        specificCategoryKey={categoryKey}
        rel="next"
        class={clx(
          "btn btn-ghost px-4 w-full",
          buttonDiff[siteTemplate].clear,
        )}
      >
        {LANGUAGE_DIFFS[language].listingPage.clear}
      </ApplicableFilters.ClearBtn>
      <ApplicableFilters.ApplyBtn
        rel="next"
        class={clx(
          "btn btn-ghost w-full px-4",
          buttonDiff[siteTemplate].apply,
        )}
      >
        {LANGUAGE_DIFFS[language].listingPage.apply}
      </ApplicableFilters.ApplyBtn>
    </div>
  );
};

const buttonDiff = {
  "elux": {
    "apply":
      "px-4 min-h-10 max-h-10 w-full bg-primary text-white rounded font-medium",
    "clear":
      "px-4 min-h-10 max-h-10 w-full bg-white text-primary rounded font-medium",
  },
  "frigidaire": {
    "apply":
      "px-4 min-h-9 max-h-9 w-full font-medium bg-primary text-white rounded-[50px]",
    "clear":
      "px-4 min-h-9 max-h-9 w-full font-medium bg-white text-primary rounded-[50px]",
  },
};
