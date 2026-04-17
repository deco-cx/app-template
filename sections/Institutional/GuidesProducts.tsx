import { AppContext } from "../../mod.ts";
import { clx } from "../../utils/clx.ts";
import { GuideProducts } from "../../loaders/guides/products.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import ProductCard from "../../components/guides/ProductCard.tsx";
import { useDevice } from "@deco/deco/hooks";
import Breadcrumb, {
  Props as BreadcrumbProps,
} from "../Content/Breadcrumb.tsx";
import { Colors } from "../../utils/types.ts";
import { LANGUAGE_DIFFS } from "../../utils/constants.tsx";

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
   * @title Products
   */
  guideLoader: GuideProducts | null;
  breadcrumb: {
    items: BreadcrumbItems[];
    hideCategoryName?: boolean;
  };
  /**
   * @title Spacing configuration
   */
  spacingConfig: SpacingConfig;
}

/**
 * @titleBy label
 */
interface BreadcrumbItems {
  /**
   * @title Label
   */
  label: string;
  /**
   * @title Href
   */
  href?: string;
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  return {
    ...props,
    siteTemplate: ctx.siteTemplate,
    language: ctx.language,
    url: req.url,
  };
};

export default function GuidesProducts(
  {
    guideLoader,
    title,
    description,
    siteTemplate,
    language,
    breadcrumb,
    spacingConfig,
  }: ReturnType<typeof loader>,
) {
  const isElux = siteTemplate === "elux";
  if (!guideLoader) {
    return <NotFound language={language} />;
  }

  const styling = isElux ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  const isDesktop = useDevice() === "desktop";

  const breadcrumbProps = isElux
    ? isDesktop ? BREADCRUMB_STYLING_ELUX : BREADCRUMB_STYLING_ELUX_MOBILE
    : BREADCRUMB_STYLING_FRIGIDAIRE;

  const newBreadcrumb = {
    ...breadcrumbProps,
    items: [
      ...breadcrumbProps.items,
      ...breadcrumb?.items?.map((item) => ({
        ...item,
        ...(isElux && {
          hoverUnderline: true,
          overrideFontColor: "primary" as Colors,
        }),
      })),
    ],
  } as BreadcrumbProps;

  if (!breadcrumb.hideCategoryName) {
    newBreadcrumb.items.push({
      label: language === "EN"
        ? guideLoader.category.alternateName ??
          guideLoader.category.name
        : guideLoader.category.name,
      ...(isElux && {
        hoverUnderline: true,
        overrideFontColor: "primary" as Colors,
      }),
    });
  }

  return (
    <Container spacing={spacingConfig} class="min-h-[80vh]">
      <Breadcrumb {...newBreadcrumb} />
      <div class="container mt-8">
        <div class="max-w-[687px] max-lg:px-6 flex flex-col">
          <h1 class={styling.title}>{title}</h1>
          <h2 class={clx(styling.description, "mt-6")}>
            {description}
          </h2>
          <div class="flex flex-col max-w-[510px] mt-8 gap-4">
            {guideLoader.products.length > 0
              ? guideLoader.products.map((product) => (
                <ProductCard
                  product={product}
                  siteTemplate={siteTemplate}
                />
              ))
              : <NotFoundCategory language={language} />}
          </div>
        </div>
      </div>
    </Container>
  );
}

const ELUX_STYLING = {
  title: "text-primary text-2.5xl font-medium lg:text-3.5xl lg:font-semibold",
  description: "text-secondary text-base font-normal",
};

const FRIGIDAIRE_STYLING = {
  title: "text-primary text-2.5xl lg:text-4xl font-semibold",
  description: "text-secondary text-sm lg:text-base font-light",
};

const BREADCRUMB_STYLING_ELUX = {
  fontColor: "primary",
  fontSize: "text-sm",
  iconSize: 24,
  fontWeight: "font-normal",
  gap: "1",
  items: [
    {
      label: "Home",
      overrideFontColor: "secondary",
      href: "/",
    },
  ],
} as BreadcrumbProps;

const BREADCRUMB_STYLING_ELUX_MOBILE = {
  fontColor: "primary",
  fontSize: "text-sm",
  items: [],
  iconSize: 24,
  fontWeight: "font-normal",
  icon: "dots-frigidaire",
  gap: "1",
} as BreadcrumbProps;

const BREADCRUMB_STYLING_FRIGIDAIRE = {
  icon: "home-frigidaire",
  iconSize: 16,
  fontColor: "primary",
  fontSize: "text-xs",
  items: [],
} as BreadcrumbProps;

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

function NotFoundCategory({ language }: { language: "EN" | "ES" }) {
  return (
    <div class="flex flex-col justify-center text-primary font-bold">
      <span>{LANGUAGE_DIFFS[language].guidesProducts.notFound}</span>
      <a
        href="javascript:history.back()"
        class="mt-1 text-base underline cursor-pointer hover:opacity-75"
      >
        {LANGUAGE_DIFFS[language].guidesProducts.goBack || "Go back"}
      </a>
    </div>
  );
}
