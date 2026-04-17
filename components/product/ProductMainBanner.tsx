import Image from "apps/website/components/Image.tsx";
import { Banner } from "../../sections/Product/ProductDetails/ProductBannerMatcher.tsx";

interface Props {
  banner: Banner & {
    secondaryTitle?: string;
  };
}

export default function ProductMainBanner({ banner }: Props) {
  if (!banner) return <></>;

  return (
    <div className="w-full relative overflow-hidden mx-auto">
      <div className="flex lg:hidden">
        <Image
          alt={banner.title}
          src={banner.image.mobile ?? ""}
          width={400}
          height={600}
          class="object-contain w-full"
        />
      </div>
      <div className="hidden lg:flex">
        <Image
          alt={banner.title}
          src={banner.image.desktop ?? ""}
          width={1280}
          height={600}
          class="object-contain w-full"
        />
      </div>
      <div class="absolute z-10 w-full h-full top-0 bg-black opacity-40"></div>
      <div class="absolute z-20 flex flex-col bottom-5 lg:bottom-32 lg:left-40 text-white px-5 lg:p-0 gap-2 max-w-96">
        {banner.secondaryTitle && (
          <span className="text-base lg:text-xl uppercase font-medium">
            {banner.secondaryTitle}
          </span>
        )}
        <h1 className="text-2.5xl lg:text-4xl font-semibold">
          {banner.title}
        </h1>
        <h2 className="text-base font-light">
          {banner.description}
        </h2>
      </div>
    </div>
  );
}
