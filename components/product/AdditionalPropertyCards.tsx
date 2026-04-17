import Image from "apps/website/components/Image.tsx";
import { PropertyValue } from "apps/commerce/types.ts";
import Slider from "../ui/Slider.tsx";
import { clx } from "../../utils/clx.ts";
import { useDevice } from "@deco/deco/hooks";
import { useId } from "../../sdk/useId.ts";
import { chunkArray } from "../../utils/utils.ts";
import { ProductDescriptionProps } from "../../sections/Product/ProductDetails/ProductPage.tsx";
import { TEXT_COLORS } from "../../utils/constants.tsx";

interface Props {
  propertyCards: PropertyValue[] | undefined;
  mergeQuantity?: number;
  productDescription?: ProductDescriptionProps;
}

export default function AdditionalPropertyCards(
  { propertyCards, mergeQuantity, productDescription }: Props,
) {
  if (!propertyCards) return <></>;

  const id = useId();

  const sortedPropertyCardsMobile = propertyCards.sort((a, b) => {
    const hasUrlA = a.image?.[0]?.url !== undefined;
    const hasUrlB = b.image?.[0]?.url !== undefined;

    if (hasUrlA && !hasUrlB) return -1;
    if (!hasUrlA && hasUrlB) return 1;
    return 0;
  });

  const getItemsToRender = () => {
    const splittedCards = sortedPropertyCardsMobile.reduce<
      { image: PropertyValue[][]; noImage: PropertyValue[] }
    >((acc, card) => {
      const hasImage = !!card.image?.[0]?.url;
      if (hasImage) {
        return {
          image: [...acc.image, [card]],
          noImage: acc.noImage,
        };
      }

      return {
        image: acc.image,
        noImage: [...acc.noImage, card],
      };
    }, { image: [], noImage: [] });

    return [
      ...splittedCards.image,
      ...chunkArray(splittedCards.noImage, mergeQuantity ?? 2),
    ];
  };

  const itemsGroups = getItemsToRender();
  const device = useDevice();

  return (
    <>
      {device === "mobile"
        ? (
          <div
            className="w-full max-w-[65rem] mx-auto flex flex-col lg:hidden py-6 gap-6"
            id={id}
          >
            <Slider class="carousel carousel-center sm:carousel-end gap-5 sm:gap-10 w-full">
              {itemsGroups.map((itemsGroup, index) => (
                <Slider.Item
                  key={index}
                  index={index}
                  className="carousel-item w-full"
                >
                  <div
                    className={`overflow-hidden flex ${
                      itemsGroup.length > 1
                        ? "flex-col gap-4"
                        : "flex-col lg:flex-row-reverse"
                    } lg:border-t border-base-200`}
                  >
                    {itemsGroup.map((item, idx) => (
                      <div
                        key={item["@id"] || idx}
                        className="w-full flex flex-col gap-6"
                      >
                        {item.image?.[0]?.url && (
                          <div className="w-full flex justify-center overflow-hidden">
                            <Image
                              alt={item.name || "Imagem do card"}
                              src={item.image[0].url}
                              width={375}
                              height={300}
                              className="object-contain w-full"
                            />
                          </div>
                        )}
                        <div className="flex flex-col flex-1 gap-2 text-secondary text-sm px-1">
                          {item.name && (
                            <span
                              class={clx(
                                productDescription?.title?.fontWeight,
                                productDescription?.title?.fontSize ??
                                  "text-sm",
                                TEXT_COLORS[
                                  productDescription?.title?.fontColor ??
                                    "secondary"
                                ],
                              )}
                            >
                              {item.name}
                            </span>
                          )}
                          {item.value && (
                            <article
                              className={clx(
                                "font-light max-w-[500px] text-secondary",
                                productDescription?.descriptionSize ??
                                  "text-sm",
                              )}
                              dangerouslySetInnerHTML={{ __html: item.value }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Slider.Item>
              ))}
            </Slider>

            {/* Dots */}
            <ul
              className={clx(
                "carousel carousel-center justify-center gap-3 px-5",
                "rounded-full",
                "border-[1px] border-slate-200",
                "flex lg:hidden",
                "max-w-40 h-6 mx-auto",
                "overflow-x-auto",
                "sm:overflow-y-auto",
              )}
              style={{ maxHeight: "600px" }}
            >
              {itemsGroups.map((_, index) => (
                <li
                  key={index}
                  className="carousel-item w-3 h-full flex justify-center items-center"
                >
                  <Slider.Dot
                    index={index}
                    className="disabled:bg-primary disabled:border-primary flex w-2.5 h-2.5 rounded-full bg-base-200 border border-white"
                  >
                  </Slider.Dot>
                </li>
              ))}
            </ul>
            <Slider.JS rootId={id} />
          </div>
        )
        : (
          <div className="w-full max-w-[65rem] mx-auto hidden lg:grid lg:grid-cols-2">
            {propertyCards.map((card, index) => {
              const isOdd = (index + 1) % 2 !== 0;
              const isLastAndOdd = index === propertyCards.length - 1 &&
                isOdd;

              return (
                <>
                  <div
                    key={card["@id"]}
                    className={clx(
                      `w-full overflow-hidden flex flex-col`,
                      !isLastAndOdd && "lg:border-b",
                      "lg:flex-row-reverse",
                      "border-base-200",
                      isOdd ? "pr-2.5" : "pl-2.5",
                    )}
                  >
                    {card.image?.[0]?.url && (
                      <div className="w-full lg:max-w-[240px] h-[240px] flex justify-center overflow-hidden self-center">
                        <Image
                          alt={card.name}
                          src={card.image[0].url}
                          width={375}
                          height={300}
                          className="object-contain w-full"
                        />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 gap-2 self-center py-4">
                      <span
                        class={clx(
                          productDescription?.title?.fontWeight,
                          productDescription?.title?.fontSize ?? "text-sm",
                          TEXT_COLORS[
                            productDescription?.title?.fontColor ?? "secondary"
                          ],
                        )}
                      >
                        {card.name}
                      </span>
                      <article
                        className={clx(
                          "font-light max-w-[500px] text-secondary",
                          productDescription?.descriptionSize ?? "text-sm",
                        )}
                        dangerouslySetInnerHTML={{ __html: card.value! }}
                      />
                    </div>
                  </div>
                  {isLastAndOdd && (
                    <div class="h-[1px] bg-base-200 hidden lg:grid col-span-2">
                    </div>
                  )}
                </>
              );
            })}
          </div>
        )}
    </>
  );
}
