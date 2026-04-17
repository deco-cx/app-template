import { Picture, Source } from "apps/website/components/Picture.tsx";

export interface Props {
  image?: string;
  mobileImage?: string;
  description?: string;
  imageSizes?: ImageSizes;
  disabledOpacity?: boolean;
}

export interface ImageSizes {
  desktopWidth?: number;
  desktopHeight?: number;
  mobileWidth?: number;
  mobileHeight?: number;
}

export default function ListingPageBanner(
  { image, description, mobileImage, imageSizes, disabledOpacity }: Props,
) {
  if (!image) return <></>;
  return (
    <div className="w-full relative overflow-hidden mx-auto">
      <div className="flex">
        <Picture class="object-contain">
          <Source
            media="(max-width: 640px)"
            alt={description ?? ""}
            src={mobileImage ?? image}
            width={imageSizes?.mobileWidth ?? 375}
            height={imageSizes?.mobileHeight ?? 240}
            class="object-contain w-full"
            loading="eager"
          />
          <Source
            media="(min-width: 640px)"
            alt={description ?? ""}
            src={image}
            width={imageSizes?.desktopWidth ?? 1280}
            height={imageSizes?.desktopHeight ?? 300}
            class="object-contain w-full"
            loading="eager"
          />
          <img
            alt={description ?? ""}
            src={image}
            class="w-full"
            loading="eager"
          />
        </Picture>
      </div>
      {!disabledOpacity && (
        <div class="absolute z-10 w-full h-full top-0 bg-black opacity-40" />
      )}
      <div class="absolute z-20 flex flex-col bottom-5 lg:bottom-12 lg:left-32 text-white px-5 lg:p-0 gap-2">
        <h1 className="text-2.5xl lg:text-4xl font-semibold">
          {description}
        </h1>
      </div>
    </div>
  );
}
