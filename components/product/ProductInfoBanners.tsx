import { clx } from "../../utils/clx.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { Banner } from "../../sections/Product/ProductDetails/ProductBannerMatcher.tsx";

export interface Props {
  banners?: Banner[];
  siteTemplate: "elux" | "frigidaire";
}

export default function ProductInfoBanners(
  { banners, siteTemplate }: Props,
) {
  const bannerColors = siteTemplate === "elux"
    ? ELUX_STYLING
    : FRIGIDAIRE_STYLING;
  return (
    <div className="w-full lg:mx-auto">
      {banners &&
        banners?.map((banner, index) => {
          const { bgColor, titleColor, descriptionColor } =
            bannerColors.banner[index % 2];
          return (
            <div
              className={clx(
                `flex flex-col-reverse`,
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
                bgColor,
              )}
            >
              <Picture class="object-contain md:w-2/4">
                <Source
                  media="(max-width: 640px)"
                  src={banner.image.mobile ?? ""}
                  width={375}
                  height={224}
                />
                <Source
                  media="(min-width: 640px)"
                  src={banner.image.desktop ?? ""}
                  width={640}
                  height={516}
                />
                <img
                  src={banner.image.desktop ?? ""}
                  alt={banner.title}
                  class="w-full"
                />
              </Picture>

              <div class="md:w-2/4 flex items-center">
                <div className="w-full h-full flex flex-col  text-left justify-center gap-4 p-0 mx-6 my-10 md:max-w-[400px] md:gap-6 md:mx-auto">
                  <span
                    className={clx(
                      "text-xl font-medium",
                      titleColor,
                    )}
                  >
                    {banner.title}
                  </span>
                  <div
                    className={clx(
                      "text-base font-light",
                      descriptionColor,
                    )}
                  >
                    {banner.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

const ELUX_STYLING = {
  banner: [
    {
      bgColor: "bg-white",
      titleColor: "text-primary",
      descriptionColor: "text-secondary",
    },
    {
      bgColor: "bg-primary",
      titleColor: "text-white",
      descriptionColor: "text-white",
    },
  ],
};

const FRIGIDAIRE_STYLING = {
  banner: [
    {
      bgColor: "bg-white",
      titleColor: "text-primary",
      descriptionColor: "text-secondary",
    },
    {
      bgColor: "bg-primary",
      titleColor: "text-white",
      descriptionColor: "text-white",
    },
  ],
};
