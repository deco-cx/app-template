import type { ImageWidget } from "apps/admin/widgets.ts";
import ListingPageBanner, {
  ImageSizes,
} from "../../components/product/ListingPageBanner.tsx";

export interface Props {
  banners?: Banner[];
}

const IMAGES_SIZES = {
  desktopWidth: 1280,
  desktopHeight: 280,
  mobileWidth: 375,
  mobileHeight: 180,
} as ImageSizes;

/**
 * @titleBy matcher
 */
export interface Banner {
  /** @description RegExp to enable this banner on the current URL. Use /feminino/* to display this banner on feminino category  */
  matcher: string;
  /** @description text to be rendered with the image */
  description?: string;
  image: {
    /** @description Image for big screens */
    desktop: ImageWidget;
    /** @description Image for small screens */
    mobile: ImageWidget;
  };
  disabledOpacity?: boolean;
}

export default function BannersMatcher(
  props: ReturnType<typeof loader>,
) {
  const { banner } = props;
  if (!banner) {
    return null;
  }
  const { description, image, disabledOpacity } = banner;
  return (
    <ListingPageBanner
      image={image.desktop}
      mobileImage={image.mobile}
      description={description}
      imageSizes={IMAGES_SIZES}
      disabledOpacity={disabledOpacity}
    />
  );
}

export const loader = (props: Props, req: Request) => {
  const { banners } = { ...props };

  // Primeiro procura por um matcher específico
  const specificBanner = banners?.find(({ matcher }) =>
    matcher !== "/*" && new URLPattern({ pathname: matcher }).test(req.url)
  );

  // Se não encontrar específico, procura pelo matcher genérico
  const fallbackBanner = banners?.find(({ matcher }) =>
    matcher === "/*" && new URLPattern({ pathname: matcher }).test(req.url)
  );

  // Retorna o banner específico se existir, senão retorna o fallback
  return { banner: specificBanner || fallbackBanner };
};
