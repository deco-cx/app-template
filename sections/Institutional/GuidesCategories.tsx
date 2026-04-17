import { AppContext } from "../../mod.ts";
import { clx } from "../../utils/clx.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { useId } from "../../sdk/useId.ts";
import InformativeModal, {
  ModalProps,
} from "../../components/ui/InformativeModal.tsx";
import { CategoryFather } from "../../loaders/guides/categories.ts";
import Collapsible from "../../components/guides/Collapsible.tsx";
import { useScript } from "@deco/deco/hooks";
import { Product } from "apps/commerce/types.ts";
import { asResolved, Resolved } from "@deco/deco";
import { useComponent } from "../Component.tsx";
import { Props as SearchResultProps } from "../../components/guides/SearchResult.tsx";

export interface Props {
  /**
   * @title Title
   */
  title: string;
  /**
   * @title Description
   */
  description: string;
  /**
   * @title Auxiliary text
   */
  auxiliaryText: string;
  /**
   * @title Categories
   */
  categories: CategoryFather[];
  /**
   * @title Search section properties
   */
  searchSection: SearchSection;
  /**
   * @title Spacing configuration
   */
  spacingConfig: SpacingConfig;
}

interface SearchSection {
  /**
   * @title Product Search Loader
   */
  loader: Resolved<Product[] | null>;
  /**
   * @title Auxiliary text
   * @format rich-text
   */
  auxiliaryText: string;
  /**
   * @title Placeholder
   */
  placeholder: string;
  /**
   * @title Helper text
   */
  helperText: string;
  /**
   * @title Modal properties
   * @description Modal information texts
   */
  modalProps: ModalProps;
}

const Component = import.meta.resolve(
  "../../components/guides/SearchResult.tsx",
);

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  return {
    ...props,
    siteTemplate: ctx.siteTemplate,
    url: req.url,
  };
};

const scroll = () => {
  const div = document.getElementById("collapse-result") as
    | HTMLDivElement
    | null;

  if (div) {
    const rect = div.getBoundingClientRect();

    // Calculate scroll needed to maintain current viewport position
    const targetScroll = globalThis.scrollY + rect.top - 200;

    globalThis.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }
};

export default function GuidesCategories(props: ReturnType<typeof loader>) {
  const styling = props.siteTemplate === "elux"
    ? ELUX_STYLING
    : FRIGIDAIRE_STYLING;
  const modalId = useId();
  const validCategories = props.categories.filter((category) =>
    category.categoryChildren.length > 0
  );
  return (
    <Container spacing={props.spacingConfig} class="container">
      <div class="max-w-[687px] max-lg:px-6 flex flex-col">
        <h1 class={styling.title}>{props.title}</h1>
        <h2 class={clx(styling.description, "mt-6")}>
          {props.description}
        </h2>
        <p class={clx(styling.auxiliaryText, "mt-6")}>
          {props.auxiliaryText}
        </p>
        {/* Categories */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    input:checked ~ label .arrow { transform: rotate(180deg); transition: transform 0.4s ease; }
                    input:not(:checked) ~ label .arrow { transform: rotate(0deg); transition: transform 0.4s ease; }
                    .collapse-result.htmx-settling > #search-result { 
                    --tw-translate-y: -20px;
                      opacity: 0;
                      transition: none;
                    }
                  .collapse-result > #search-result {
                    --tw-translate-y: 0;
                    opacity: 1;
                    transition-property: opacity, transform;
                    transition-timing-function: ease-in-out;
                    transition-duration: 150ms;
                  }
                    `,
          }}
        />
        <ul class="my-8 flex flex-col">
          {validCategories.map((category) => (
            <li
              class={clx(
                "flex flex-col gap-4 border-b last:border-b-0 first:border-t",
                styling.collapsibleBorder,
              )}
            >
              <Collapsible
                category={category}
                siteTemplate={props.siteTemplate}
              />
            </li>
          ))}
        </ul>
        <div
          class={clx(
            "w-full flex flex-col p-4 group",
            styling.searchSection.container,
          )}
        >
          <div class="lg:min-h-[37px] min-h-[58px]">
            {/** Auxiliary text */}
            <div
              class={clx(
                "mb-4",
                styling.searchSection.auxiliaryText,
              )}
              dangerouslySetInnerHTML={{
                __html: props.searchSection.auxiliaryText,
              }}
            />
            {/** Seachbar result */}
            <div
              class="collapse collapse-open rounded-none"
              id="collapse-search"
            >
              <div class="collapse-content p-0">
                <div id="collapse-result" class="collapse-result" />
              </div>
            </div>
            <style
              dangerouslySetInnerHTML={{
                __html: `
      
    `,
              }}
            />
          </div>
          {/* Searchbar */}
          <div class="relative group">
            <input
              type="text"
              name="term"
              placeholder={props.searchSection.placeholder}
              class={clx(
                "w-full bg-white peer",
                styling.searchSection.input,
              )}
              autocomplete="off"
              hx-target={`#collapse-result`}
              hx-post={props.searchSection.loader &&
                useComponent<SearchResultProps>(Component, {
                  loader: asResolved(props.searchSection.loader),
                  siteTemplate: props.siteTemplate,
                })}
              hx-swap="innerHTML settle:75ms"
              hx-trigger={`input changed delay:350ms`}
              hx-select="section>*"
              hx-on-htmx-after-request={useScript(scroll)}
            />
            <Icon
              id="search"
              class={clx(
                "absolute left-4 top-1/2 -translate-y-1/2 group-has-[.htmx-request]:hidden",
                styling.searchSection.icon,
              )}
              width={24}
              height={24}
            />
            <span class="absolute left-4 top-1/2 -translate-y-1/2 loading loading-spinner hidden group-has-[.htmx-request]:block text-primary h-6 w-6" />
          </div>
          <div
            class={clx(
              styling.searchSection.helperText,
              "flex flex-row",
            )}
          >
            <label
              for={modalId}
              class="flex flex-row gap-1 lg:gap-2 mt-3 lg:mt-2 items-center cursor-pointer"
            >
              <Icon id="error" width={16} height={16} />
              <span>{props.searchSection.helperText}</span>
            </label>
            <input
              type="checkbox"
              class="hidden modal-toggle -z-50"
              id={modalId}
            />
            <div class="modal bg-[#C9C9CA] top-0 right-0 w-[100vw]">
              <InformativeModal
                modalId={modalId}
                siteTemplate={props.siteTemplate}
                modalProps={props.searchSection.modalProps}
              >
              </InformativeModal>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

const ELUX_STYLING = {
  title: "text-primary text-2.5xl font-medium lg:text-3.5xl lg:font-semibold",
  description: "text-secondary text-base font-normal",
  auxiliaryText: "text-primary text-base font-medium",
  collapsibleBorder: "border-warning lg:border-[#DEE7EA]",
  searchSection: {
    container: "bg-[#F4F5F7] rounded",
    auxiliaryText: "text-secondary text-base [&_strong]:font-medium",
    input:
      "border border-neutral rounded-sm pl-12 h-12 text-base placeholder:text-success-content text-secondary leading-6",
    helperText: "text-primary text-sm lg:text-base",
    icon: "text-primary",
  },
};

const FRIGIDAIRE_STYLING = {
  title: "text-primary text-2.5xl lg:text-4xl font-semibold",
  description: "text-secondary text-sm lg:text-base font-light",
  auxiliaryText: "text-secondary text-sm lg:text-base font-medium",
  collapsibleBorder: "border-neutral",
  searchSection: {
    container: "bg-base-300 rounded",
    auxiliaryText:
      "text-secondary text-sm lg:text-base font-light [&_strong]:font-medium",
    input:
      "border border-accent rounded-sm pl-12 h-12 text-sm lg:text-base placeholder:text-info text-secondary font-light !leading-[80px]",
    helperText: "text-secondary text-sm lg:text-base font-light",
    icon: "text-secondary",
  },
};
