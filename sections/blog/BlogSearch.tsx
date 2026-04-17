import Container, { SpacingConfig } from "../container/Container.tsx";
import { AppContext } from "../../mod.ts";
import { clx } from "../../utils/clx.ts";
import { type SectionProps } from "@deco/deco";
import Icon from "../../components/ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";

const ACTION = "q";
const INPUT_ID = "search-blog";

/**
 * @titleBy name
 */
interface SearchCategory {
  /**
   * @title Category name
   */
  name: string;
  /**
   * @title Category slug
   */
  slug: string;
  /**
   * @title Is default
   */
  default?: boolean;
}

interface Props {
  /**
   * @title Category section
   */
  categorySection: CategorySection;
  /**
   * @title Search section
   */
  searchSection: SearchSection;
  /**
   * @title Spacing config
   */
  spacing: SpacingConfig;
}

interface CategorySection {
  /**
   * @title Category section title
   */
  title: string;
  /**
   * @title Blog categories
   */
  categories: SearchCategory[];
}

interface SearchSection {
  /**
   * @title Search section title
   */
  title: string;
  /**
   * @title Clear text
   */
  clearText: string;
  /**
   * @title Search placeholder
   */
  placeholder: string;
  /**
   * @title Search button text
   */
  searchButtonText: string;
}

export function loader(props: Props, req: Request, ctx: AppContext) {
  const { siteTemplate } = ctx;
  const url = new URL(req.url);
  const pathname = url.pathname.split("/");
  const query = url.searchParams.get(ACTION);

  if (pathname[1] === "blog" && pathname.length > 2) {
    return {
      ...props,
      siteTemplate,
      markedValue: props.categorySection.categories.findIndex((c) =>
        c.slug.replace(/\//g, "") === pathname[pathname.length - 1]
      ),
      query,
    };
  }

  return {
    ...props,
    siteTemplate,
    markedValue: props.categorySection.categories.findIndex((c) => c.default),
    query,
  };
}

const handleCategoryClick = (slug: string) => {
  const cleanSlug = slug.replace(/\//g, "");
  globalThis.location.href = `/blog/${cleanSlug}`;
};

const handleCleanSearchClick = (id: string, action: string) => {
  const url = new URL(globalThis.location.href);
  const inputElement = document.getElementById(id) as HTMLInputElement;

  if (url.searchParams.has(action)) {
    url.searchParams.delete(action);
    globalThis.location.href = url.toString();
    return;
  }

  if (inputElement?.value) {
    inputElement.value = "";
    return;
  }
};

const script = () => {
  const validateForm = () => {
    const requiredFields = document.querySelectorAll(
      "[data-required]",
    ) as NodeListOf<HTMLInputElement>;
    const allFields = Array.from(requiredFields).reduce((isValid, field) => {
      if (!field.value.trim()) {
        return false;
      }
      return isValid;
    }, true);
    return allFields;
  };

  const form = document.querySelector("form");
  const submitButton = document.querySelector('button[type="submit"]');
  if (form && submitButton) {
    submitButton.addEventListener("click", function (event) {
      if (!validateForm()) {
        event.preventDefault();
      }
    });
  }
};

export default function BlogSearch(props: SectionProps<typeof loader>) {
  const {
    categorySection,
    spacing,
    siteTemplate,
    markedValue,
    searchSection,
    query,
  } = props;
  const { container, categoryStyling, searchStyling } = siteTemplate === "elux"
    ? ELUX_STYLING
    : FRIGIDAIRE_STYLING;
  return (
    <Container
      spacing={spacing}
      class="container px-6 lg:px-0"
    >
      <div
        class={clx("px-4 py-6 flex flex-col lg:flex-row relative", container)}
      >
        {/* Category section */}
        {categorySection.categories && categorySection.categories.length > 0 &&
          (
            <div class="lg:min-w-[582px] flex flex-col lg:flex-row lg:justify-between">
              <div class="flex flex-col gap-2">
                {/* Category section title */}
                <p class={categoryStyling.title}>{categorySection.title}</p>
                <div class="flex flex-row flex-wrap gap-2">
                  {/* Category section buttons */}
                  {categorySection.categories.map((category, index) => (
                    <label
                      class={clx(
                        categoryStyling.button,
                        "h-[34px] leading-3 content-center cursor-pointer",
                        "has-[:checked]:cursor-default has-[:checked]:pointer-events-none",
                        "btn btn-ghost min-h-[34px]",
                      )}
                    >
                      <input
                        type="radio"
                        name="blog-category"
                        value={index}
                        class="peer hidden"
                        defaultChecked={index === markedValue}
                        hx-on:click={useScript(
                          handleCategoryClick,
                          category.slug,
                        )}
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div
                class={clx(
                  "my-5 h-0 border-t lg:border-t-0 lg:h-auto lg:w-0 lg:border-l lg:my-0 lg:mx-5",
                  categoryStyling.hr,
                )}
              />
            </div>
          )}
        {/* Search section */}
        <div class="flex flex-col gap-2 w-full self-center">
          {/* Search section title */}
          <p class={searchStyling.title}>{searchSection.title}</p>
          <form class="flex flex-row gap-4">
            {/* Searchbar */}
            <div class="relative group w-full">
              <input
                type="text"
                name={ACTION}
                placeholder={searchSection.placeholder}
                id={INPUT_ID}
                class={clx(
                  "w-full bg-white peer pr-3",
                  searchStyling.input,
                )}
                autocomplete="off"
                value={query ?? ""}
                data-required
              />
              <Icon
                id="search"
                class={clx(
                  "absolute left-4 top-1/2 -translate-y-1/2",
                  searchStyling.icon,
                )}
                width={24}
                height={24}
              />
            </div>
            <button
              class={clx(searchStyling.button, "btn btn-ghost")}
              type="submit"
            >
              {searchSection.searchButtonText}
            </button>
          </form>
        </div>
        <div
          class="absolute top-3 right-3 lg:top-4 lg:right-4 z-10 cursor-pointer"
          hx-on:click={useScript(handleCleanSearchClick, INPUT_ID, ACTION)}
        >
          <span class={searchStyling.clearSearch}>
            {searchSection.clearText}
          </span>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{ __html: useScript(script) }}
      />
    </Container>
  );
}

const ELUX_STYLING = {
  container: "bg-base-content border border-[#DEE7EA]",
  categoryStyling: {
    title: "text-sm text-primary font-medium",
    button:
      "text-sm text-primary font-medium px-3 rounded-[40px] border border-primary has-[:checked]:bg-primary has-[:checked]:text-white hover:bg-primary hover:text-white",
    hr: "border-warning",
  },
  searchStyling: {
    title: "text-sm text-primary font-medium",
    input:
      "border border-neutral rounded-sm pl-12 h-12 text-base placeholder:text-success-content text-primary leading-6",
    icon: "text-primary",
    button:
      "text-base text-white bg-primary font-medium px-4 rounded-sm hover:bg-warning",
    clearSearch:
      "text-sm text-primary font-light underline lg:underline-offset-2",
  },
};

const FRIGIDAIRE_STYLING = {
  container: "bg-base-300 border border-base-200",
  categoryStyling: {
    title: "text-sm text-secondary font-medium",
    button:
      "text-sm text-primary font-medium px-3 rounded-[40px] border border-primary has-[:checked]:bg-primary has-[:checked]:text-white hover:bg-primary hover:text-white",
    hr: "border-warning",
  },
  searchStyling: {
    title: "text-sm text-secondary font-medium",
    input:
      "border border-base-200 rounded pl-12 h-12 text-base placeholder:text-accent text-secondary font-light placeholder:font-medium",
    icon: "text-primary",
    button:
      "text-sm text-white bg-primary font-medium px-5 rounded-[50px] min-h-10.5 h-10.5 self-center leading-6",
    clearSearch:
      "text-sm text-secondary font-light underline lg:underline-offset-2",
  },
};

export const LoadingFallback = (
  { spacing }: Partial<Props>,
) => {
  return (
    <Container
      spacing={spacing}
      class="container px-6 lg:px-0 flex justify-center items-center"
    >
      <div class="h-64 lg:h-32 content-center">
        <span class="loading loading-lg loading-spinner text-primary" />
      </div>
    </Container>
  );
};
