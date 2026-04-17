import {
  BreadcrumbList,
  ListItem,
  Product,
  ProductDetailsPage,
} from "apps/commerce/types.ts";
import Breadcrumb, {
  Props as BreadcrumbProps,
} from "../../Content/Breadcrumb.tsx";
import { Colors, FontWeight } from "../../../utils/types.ts";
import Container, { SpacingConfig } from "../../container/Container.tsx";
import { AppContext } from "../../../mod.ts";

interface PDPBreadcrumbProps extends
  Omit<
    BreadcrumbProps,
    "items" | "fontColor" | "spacing" | "disableContainer"
  > {
  /** @description Breadcrumb icon color */
  iconColor: Colors;
  /** @description Breadcrumb font color */
  breadcrumbColor: Colors;
  /** @description Max qty of items in breadcrumb */
  maxItems?: number;
  /** @description Hide product name in breadcrumb */
  hideProductName?: boolean;
  /** @description Override first item of breadcrumb */
  overrideFirst?: {
    item: string;
    url: string;
  };
}

interface Props {
  /** @description Breadcrumb props */
  breadcrumbProps: PDPBreadcrumbProps;
  /** @description Loader */
  page: ProductDetailsPage | null;
  /** @description Spacing configuration from deco */
  spacing?: SpacingConfig;
}

export default function ProductBreadcrumb({
  breadcrumbProps,
  page,
  spacing,
  siteTemplate,
}: ReturnType<typeof loader>) {
  if (!page) return <></>;
  const { product, breadcrumbList } = page;
  const breadcrumbItems = getBreadcrumbItems(
    breadcrumbList,
    breadcrumbProps,
    product,
    siteTemplate,
  );
  return (
    <Container class="flex flex-col" spacing={spacing}>
      <div class="w-full flex flex-row justify-center">
        <div class="w-[1280px] sm:pl-10">
          <Breadcrumb
            {...breadcrumbProps}
            items={breadcrumbItems}
            fontColor={breadcrumbProps.iconColor}
            disableContainer={true}
          />
        </div>
      </div>
    </Container>
  );
}

export const loader = (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  return {
    language: ctx.language,
    siteTemplate: ctx.siteTemplate,
    ...props,
  };
};

const sortAndFilterBreadcrumbItems = (items: ListItem[]): ListItem[] =>
  Object.values(
    [...items].sort((a, b) =>
      a.position === b.position
        ? a.item.localeCompare(b.item)
        : a.position - b.position
    ).reduce((acc, item) => ({
      ...acc,
      [item.position]: acc[item.position] || item,
    }), {} as Record<number, ListItem>),
  );

const getBreadcrumbItems = (
  breadcrumbList: BreadcrumbList,
  breadcrumbProps: PDPBreadcrumbProps,
  product: Product,
  siteTemplate: "frigidaire" | "elux",
) => {
  const orderedBreadcrumbList = sortAndFilterBreadcrumbItems(
    [
      ...breadcrumbList.itemListElement,
      ...breadcrumbProps.overrideFirst
        ? [{
          "@type": "ListItem" as const,
          position: 0,
          ...breadcrumbProps.overrideFirst,
        }]
        : [],
    ],
  ).slice(
    0,
    (breadcrumbProps.maxItems ?? 3) -
      (breadcrumbProps.hideProductName ? 0 : 1),
  );
  const breadcrumbItems = orderedBreadcrumbList.map(({ item, url }) => ({
    label: item,
    href: url,
    overrideFontColor: breadcrumbProps.breadcrumbColor,
    hoverUnderline: false,
    overrideFontWeight: undefined,
  })) as {
    label: string;
    href: string | undefined;
    overrideFontColor: Colors;
    hoverUnderline: boolean;
    overrideFontWeight: FontWeight | undefined;
  }[];

  if (!breadcrumbProps.hideProductName) {
    breadcrumbItems.push({
      label: product.name!,
      overrideFontColor: "primary",
      href: undefined,
      hoverUnderline: siteTemplate === "elux" ? true : false,
      overrideFontWeight: siteTemplate === "frigidaire"
        ? "font-medium" as FontWeight
        : undefined,
    });
  }

  return breadcrumbItems;
};

export const LoadingFallback = ({ spacing }: Partial<Props>) => {
  return (
    <Container
      spacing={spacing}
      class="container px-6 lg:px-0 flex justify-center items-center"
    >
      <div class="h-5 content-center">
        <span class="loading loading-dots loading-md text-primary" />
      </div>
    </Container>
  );
};
