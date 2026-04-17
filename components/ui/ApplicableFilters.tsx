import { useScript } from "@deco/deco/hooks";
import type { JSX } from "preact";

function ApplicableFilters(props: JSX.IntrinsicElements["div"]) {
  return <div {...props} />;
}

function FilterInput(
  { categoryKey, filterValue, ...props }: JSX.IntrinsicElements["input"] & {
    categoryKey: string;
    filterValue: string;
  },
) {
  return (
    <input
      data-filter-input
      data-category-key={categoryKey}
      data-filter-value={filterValue}
      type="checkbox"
      {...props}
    />
  );
}

function ClearFiltersButton(
  { specificCategoryKey, ...props }: JSX.IntrinsicElements["button"] & {
    specificCategoryKey?: string;
  },
) {
  return (
    <button
      data-clear-filters
      type="button"
      data-clear-category={specificCategoryKey}
      {...props}
    />
  );
}

function ApplyFiltersButton(props: JSX.IntrinsicElements["button"]) {
  return <button data-apply-filters type="button" {...props} />;
}

function CounterSpan(
  { categoryKey, ...props }: JSX.IntrinsicElements["span"] & {
    categoryKey: string;
  },
) {
  return <span data-counter-span data-counter-for={categoryKey} {...props} />;
}

function ListSpan(
  { categoryKey, ...props }: JSX.IntrinsicElements["span"] & {
    categoryKey: string;
  },
) {
  return <span data-list-span data-list-for={categoryKey} {...props} />;
}

function JS({ rootId }: Props) {
  return (
    <script
      type="module"
      dangerouslySetInnerHTML={{ __html: useScript(onLoad, { rootId }) }}
    />
  );
}

export interface Props {
  rootId: string;
}

const onLoad = ({ rootId }: Props) => {
  function init() {
    const root = document.getElementById(rootId);
    const clearBtns = root?.querySelectorAll<HTMLButtonElement>(
      "[data-clear-filters]",
    );
    const applyBtns = root?.querySelectorAll<HTMLButtonElement>(
      "[data-apply-filters]",
    );
    const inputs = root?.querySelectorAll<HTMLInputElement>(
      "[data-filter-input]",
    );
    const countersSelector = root?.querySelectorAll<HTMLSpanElement>(
      "[data-counter-span]",
    );
    const listSpansSelector = root?.querySelectorAll<HTMLSpanElement>(
      "[data-list-span]",
    );

    const counters = countersSelector
      ? Array.from(countersSelector)
      : undefined;
    const listSpans = listSpansSelector
      ? Array.from(listSpansSelector)
      : undefined;

    if (!root || !inputs) {
      console.warn("Missing necessary filter elements", {
        root,
        inputs,
      });
      return;
    }

    // Update counter and list span
    const updateCounterAndList = (categoryKey: string) => {
      // Find counter
      const counter = counters?.find(
        (counter) => counter.getAttribute("data-counter-for") === categoryKey,
      );
      // Find list span
      const listSpan = listSpans?.find(
        (listSpan) => listSpan.getAttribute("data-list-for") === categoryKey,
      );
      if (counter || listSpan) {
        // Get checked inputs
        const checkedInputs = Array.from(inputs).filter(
          (input) =>
            input.checked &&
            input.getAttribute("data-category-key") === categoryKey,
        );
        // Get inputs quantity
        const inputsQty = checkedInputs.length;

        // If no checked inputs, hide counter and list span
        if (inputsQty === 0) {
          if (counter) {
            counter.classList.add("hidden");
            counter.classList.remove("inline");
          }
          if (listSpan) {
            listSpan.classList.add("hidden");
            listSpan.classList.remove("inline");
          }
        } else {
          // If checked inputs, show counter and list span
          if (counter) {
            counter.classList.remove("hidden");
            counter.classList.add("inline");
            counter.textContent = checkedInputs.length.toString();
          }
          if (listSpan) {
            listSpan.classList.remove("hidden");
            listSpan.classList.add("inline");
            listSpan.textContent = checkedInputs.map((input) => {
              const label = input.closest("span");
              return label?.textContent?.trim() ||
                input.getAttribute("data-filter-value");
            }).join(", ");
          }
        }
      }
    };

    const handleInputChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const categoryKey = input.getAttribute("data-category-key");
      if (categoryKey) {
        updateCounterAndList(categoryKey);
      }
    };

    const handleApplyFilters = () => {
      const selectedFilters = new Map<string, string[]>();

      inputs.forEach((input) => {
        if (input.checked) {
          const filterValue = input.getAttribute(
            "data-filter-value",
          );
          const categoryKey = input.getAttribute(
            "data-category-key",
          );
          if (filterValue && categoryKey) {
            selectedFilters.set(categoryKey, [
              ...(selectedFilters.get(categoryKey) || []),
              filterValue,
            ]);
          }
        }
      });
      const newUrl = new URL(
        globalThis.location.pathname,
        globalThis.location.origin,
      );
      selectedFilters.forEach((values, key) => {
        if (key === "categoria") {
          newUrl.pathname = `${globalThis.location.pathname}/${values[0]}`;
        } else {
          newUrl.searchParams.set(key, values.join("_"));
        }
      });

      globalThis.location.href = newUrl.toString();
    };

    const handleClearFilters = (event: Event) => {
      const btn = event.target as HTMLButtonElement;
      const categoryKey = btn.getAttribute("data-clear-category");

      if (categoryKey) {
        inputs.forEach((input) => {
          if (input.getAttribute("data-category-key") === categoryKey) {
            input.checked = false;
          }
        });
        counters?.forEach((counter) => {
          if (counter.getAttribute("data-counter-for") === categoryKey) {
            counter.classList.add("hidden");
            counter.classList.remove("inline");
          }
        });
        listSpans?.forEach((listSpan) => {
          if (listSpan.getAttribute("data-list-for") === categoryKey) {
            listSpan.classList.add("hidden");
            listSpan.classList.remove("inline");
          }
        });
      } else {
        inputs.forEach((input) => {
          input.checked = false;
        });
        counters?.forEach((counter) => {
          counter.classList.add("hidden");
          counter.classList.remove("inline");
        });
        listSpans?.forEach((listSpan) => {
          listSpan.classList.add("hidden");
          listSpan.classList.remove("inline");
        });
      }
    };

    // Add handleApplyFilters event listener to apply buttons
    applyBtns?.forEach((btn) => {
      btn.addEventListener("click", handleApplyFilters);
    });

    // Add handleClearFilters event listener to clear buttons
    clearBtns?.forEach((btn) => {
      btn.addEventListener("click", handleClearFilters);
    });

    // Add handleInputChange event listener to inputs
    if (counters || listSpans) {
      inputs.forEach((input) => {
        input.addEventListener("change", handleInputChange);
      });
      counters?.forEach((counter) => {
        const categoryKey = counter.getAttribute("data-counter-for");
        if (categoryKey) {
          updateCounterAndList(categoryKey);
        }
      });
    }
  }

  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
};

ApplicableFilters.Input = FilterInput;
ApplicableFilters.ClearBtn = ClearFiltersButton;
ApplicableFilters.ApplyBtn = ApplyFiltersButton;
ApplicableFilters.Counter = CounterSpan;
ApplicableFilters.List = ListSpan;
ApplicableFilters.JS = JS;
export default ApplicableFilters;
