import { ImageWidget } from "apps/admin/widgets.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import Container from "../../container/Container.tsx";
import ProductMainBanner from "../../../components/product/ProductMainBanner.tsx";
import ProductInfoBanners from "../../../components/product/ProductInfoBanners.tsx";
import { AppContext } from "../../../mod.ts";

/**
 * @titleBy title
 */
export interface Banner {
  /**
   * @description The banner title
   */
  title: string;
  /**
   * @description The banner description
   */
  description: string;
  image: {
    /** @description Image for big screens */
    desktop: ImageWidget;
    /** @description Image for small screens */
    mobile: ImageWidget;
  };
  /**
   * @description Enable/disable opacity effect
   */
  disabledOpacity?: boolean;
}

interface SecondaryBanner {
  /**
   * @description The banner title
   */
  title: string;
  /**
   * @description Optional secondary title for the banner
   */
  secondaryTitle?: string;
  /**
   * @description The banner description
   */
  description: string;
  image: {
    /** @description Image for big screens */
    desktop: ImageWidget;
    /** @description Image for small screens */
    mobile: ImageWidget;
  };
  /**
   * @description Enable/disable opacity effect
   */
  disabledOpacity?: boolean;
}

/**
 * @titleBy matcher
 */
interface ProductBanners {
  /**
   * @description RegExp to enable this banner on the current URL. Use /test-product/p to display this banner on the product page with the same url.
   */
  matcher: string;
  /**
   * @description Main banner of the product
   */
  mainBanner: SecondaryBanner;
  /**
   * @description Additional alternating banners
   */
  alternatingBanners?: Banner[];
}

interface Props {
  /**
   * @description Array of product banners with URL matchers
   */
  banners: ProductBanners[];
  /**
   * @title Loader
   */
  product: ProductDetailsPage | null;
}

export function LoadingFallback() {
  return (
    <Container class="flex flex-col items-center justify-center">
      <div class="w-full h-[260px] flex items-center justify-center">
        <div class="loading loading-spinner loading-lg text-primary"></div>
      </div>
    </Container>
  );
}

export default function ProductBannerMatcher(
  { banner = null, siteTemplate }: ReturnType<typeof loader>,
) {
  if (!banner) {
    return <></>;
  }

  const { mainBanner, alternatingBanners } = banner;

  return (
    <Container class="flex flex-col">
      <ProductMainBanner banner={mainBanner} />
      <ProductInfoBanners
        banners={alternatingBanners}
        siteTemplate={siteTemplate}
      />
    </Container>
  );
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  const { banners, product, ...rest } = props;
  const { siteTemplate } = ctx;

  if (!product) {
    return {
      banner: null,
      ...rest,
      siteTemplate,
    };
  }

  const specificBanner = banners?.find(({ matcher }) =>
    matcher !== "/*" && new URLPattern({ pathname: matcher }).test(req.url)
  );

  const fallbackBanner = banners?.find(({ matcher }) =>
    matcher === "/*" && new URLPattern({ pathname: matcher }).test(req.url)
  );

  return { banner: specificBanner || fallbackBanner, ...rest, siteTemplate };
};
