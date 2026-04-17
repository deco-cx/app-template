import { ListItem, ProductListingPage as PLP } from "apps/commerce/types.ts";
import { Colors } from "../../../utils/types.ts";
import Breadcrumb, {
  Items,
  Props as BreadcrumbProps,
} from "../../Content/Breadcrumb.tsx";
import { AppContext } from "../../../mod.ts";
import Container, { SpacingConfig } from "../../container/Container.tsx";
import ListingPageBanner from "../../../components/product/ListingPageBanner.tsx";
import SearchResult, {
  Layout,
} from "../../../components/product/SearchResult.tsx";
import { CardStyling } from "../../../components/product/ProductCard.tsx";
import { productListingStylingDiffs } from "../../../utils/styling/product/productListing/stylingDiff.ts";
import { useDevice } from "@deco/deco/hooks";
import { LANGUAGE_DIFFS } from "../../../utils/constants.tsx";

export interface Props {
  page: PLP | null;
  /** @description Spacing config */
  spacing?: SpacingConfig;
  /**
   * @ignore
   */
  partial?: "hideMore" | "hideLess";
}

export interface ListingMainProps {
  /** @description Font color for filters */
  filtersFontColor?: Colors;
  /** @description Card styling config */
  cardStyling: CardStyling;
  layout?: Layout;
  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;
  filterIconUrl: string;
}

export interface PLPBreadcrumbProps extends
  Omit<
    BreadcrumbProps,
    "items" | "fontColor" | "spacing" | "disableContainer"
  > {
  /** @description Breadcrumb icon color */
  iconColor: Colors;
  /** @description Breadcrumb font color */
  breadcrumbColor: Colors;
  /** @description Override first item of breadcrumb */
  overrideFirst?: {
    item: string;
    url: string;
  };
  /**
   * @title Underline on hover
   */
  hoverUnderline?: boolean;
}

export const loader = (
  props: Props,
  req: Request,
  ctx: AppContext,
) => {
  return {
    language: ctx.language,
    url: req.url,
    siteTemplate: ctx.siteTemplate,
    ...props,
  };
};

export default function ProductListingPage(
  { spacing, page, url, siteTemplate, partial, language }: ReturnType<
    typeof loader
  >,
) {
  if (!page) return <NotFound language={language} />;

  const device = useDevice();
  const { breadcrumbProps, listingMain } =
    productListingStylingDiffs[siteTemplate][
      device === "desktop" ? "desktop" : "mobile"
    ];

  if (partial) {
    return (
      <SearchResult
        page={page}
        url={url}
        listingMain={listingMain}
        partial={partial}
        language={language}
        siteTemplate={siteTemplate}
      />
    );
  }

  const breadcrumbItems = getBreadcrumbItems(
    page.breadcrumb.itemListElement,
    breadcrumbProps,
  );

  const mainBreadcrumbItem = page.breadcrumb.itemListElement.reduce((
    highest,
    current,
  ) => (current.position > highest.position) ? current : highest);

  return (
    <Container class="flex flex-col" spacing={spacing}>
      <div class="w-full flex flex-row lg:justify-center">
        <div class="my-6 w-[1280px] sm:pl-10">
          <Breadcrumb
            {...breadcrumbProps}
            items={breadcrumbItems}
            fontColor={breadcrumbProps.iconColor}
            disableContainer={true}
            iconSize={siteTemplate === "elux" ? 24 : 16}
          />
        </div>
      </div>
      <ListingPageBanner
        image={mainBreadcrumbItem?.image?.[0]?.url}
        description={mainBreadcrumbItem?.description}
      />
      <SearchResult
        page={page}
        url={url}
        listingMain={listingMain}
        partial={partial}
        language={language}
        siteTemplate={siteTemplate}
        mainBreadcrumbItem={mainBreadcrumbItem}
      />
    </Container>
  );
}

function NotFound({ language }: { language: "EN" | "ES" }) {
  return (
    <div class="w-full flex flex-col justify-center items-center py-10 text-primary font-bold text-2xl h-[50vh]">
      <span>{LANGUAGE_DIFFS[language].listingPage.notFound}</span>
      <a
        href="javascript:history.back()"
        class="mt-4 text-base underline cursor-pointer hover:opacity-75"
      >
        {LANGUAGE_DIFFS[language].listingPage.goBack || "Go back"}
      </a>
    </div>
  );
}

const getBreadcrumbItems = (
  items: ListItem[],
  props: PLPBreadcrumbProps,
): Items[] => {
  const breadcrumbItems: Items[] = items.map((item) => ({
    label: item.item,
    href: item.url,
    hoverUnderline: props.hoverUnderline,
    overrideFontColor: props.breadcrumbColor,
  }));

  if (props.overrideFirst) {
    breadcrumbItems.unshift({
      label: props.overrideFirst.item,
      href: props.overrideFirst.url,
    });
  }

  return breadcrumbItems;
};
