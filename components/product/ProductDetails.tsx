import { PropertyValue } from "apps/commerce/types.ts";
import AdditionalPropertyCards from "./AdditionalPropertyCards.tsx";
import Icon from "../ui/Icon.tsx";
import {
  BG_COLORS,
  BORDER_COLORS,
  DEFAULT_TECH_SHEET_CONFIG,
  HOVER_BORDER_COLORS,
  HOVER_FONT_WEIGHT,
  HOVER_TEXT_COLORS,
  LANGUAGE_DIFFS,
  TEXT_COLORS,
} from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import { ProductMainProps } from "../../sections/Product/ProductDetails/ProductPage.tsx";
import { iconMap } from "../../utils/product/constants.ts";

interface Props {
  additionalProperty: PropertyValue[] | undefined;
  description: string | undefined;
  language: "EN" | "ES";
  productMain: ProductMainProps;
}

export default function ProductDetails(
  { additionalProperty, description, language, productMain }: Props,
) {
  const { tabs } = productMain;
  const dimensionsProperties =
    additionalProperty?.filter((property) =>
      property.propertyID === "HEIGHT" || property.propertyID === "WIDTH" ||
      property.propertyID === "DEPTH" || property.propertyID === "WEIGHT"
    ) ?? [];
  const dimensionsPropertiesWithBox =
    additionalProperty?.filter((property) =>
      property.propertyID === "BOX_HEIGHT" ||
      property.propertyID === "BOX_WIDTH" ||
      property.propertyID === "BOX_DEPTH" ||
      property.propertyID === "BOX_WEIGHT"
    ) ?? [];

  const propertyCards = additionalProperty?.filter((property) =>
    property.propertyID === "DESCRIPTION"
  );

  const tableProperties = additionalProperty
    ?.filter((property) => property.propertyID === "OTHER")
    .reduce((acc: PropertyValue[], current) => {
      const existingProperty = acc.find((item) => item.name === current.name);

      if (existingProperty) {
        existingProperty.value = `${existingProperty.value}/${current.value}`;
        return acc;
      }

      return [...acc, current];
    }, []) ?? [];

  const hasDimensions = dimensionsProperties?.length > 0;
  const hasDimensionsWithBox = dimensionsPropertiesWithBox?.length > 0;
  const hasTableProperties = tableProperties?.length > 0;

  const techSheetConfig =
    !tabs?.techSheet?.length || tabs?.techSheet?.length < 2
      ? DEFAULT_TECH_SHEET_CONFIG
      : tabs?.techSheet;

  const techSheetConfigSize = techSheetConfig.length;

  const getIconId = (propertyID: string) => {
    if (iconMap[propertyID]) return iconMap[propertyID];

    const cleanedPropertyID = propertyID.replace(/^BOX_/, "");

    return iconMap[cleanedPropertyID] || "depth-property";
  };

  const DimensionsCards: React.FC<Pick<Props, "additionalProperty">> = (
    { additionalProperty: dimensions },
  ) => {
    const isGrid = dimensions && dimensions.length > 3;
    return (
      <ul
        className={clx(
          !isGrid
            ? "flex flex-row items-center"
            : "grid grid-cols-2 lg:flex lg:items-center",
          "w-full text-secondary",
        )}
      >
        {dimensions?.map((dimension, index) => {
          const iconId = getIconId(dimension.propertyID ?? "");
          return (
            <>
              <li
                className={clx(
                  "flex flex-col gap-1 items-center justify-center flex-1 py-1.5 my-2",
                  "border-l border-base-200 first:border-0",
                  index % 2 === 0 && isGrid && "max-lg:!border-0",
                )}
                key={dimension["@id"]}
              >
                <Icon id={iconId} className="text-primary" size={24} />
                <div class="flex gap-1 items-end font-medium">
                  <span className="mt-1">{dimension.value}</span>
                  {dimension.unitCode && <span>{dimension.unitCode}</span>}
                </div>
                <span className="font-light text-sm">{dimension.name}</span>
              </li>
              {index === 1 && isGrid && (
                <div className="lg:hidden block h-px bg-base-200 col-span-2" />
              )}
            </>
          );
        })}
      </ul>
    );
  };

  if (!hasDimensions && !hasDimensionsWithBox && !hasTableProperties) {
    return null;
  }

  return (
    <div
      class={clx("w-full lg:pb-6", BG_COLORS[productMain.bgColor ?? "white"])}
    >
      <div className="w-full max-w-[65rem] mx-auto px-5 lg:px-0">
        <div class="hidden lg:flex w-full pb-6 gap-1">
          <a
            href="#description"
            class={clx(
              "flex flex-1 border-b-2 items-center justify-center pb-3 pt-4",
              TEXT_COLORS[tabs?.enabledTab?.fontColor ?? "base-content"],
              tabs?.enabledTab?.fontSize,
              tabs?.enabledTab?.fontWeight ?? "font-light",
              BORDER_COLORS[tabs?.enabledTab?.underlineColor ?? "neutral"],
            )}
          >
            {LANGUAGE_DIFFS[language].productPage.descriptionTitle}
          </a>
          <a
            href="#properties"
            class={clx(
              "flex flex-1 border-b-2 items-center justify-center pb-3 pt-4",
              TEXT_COLORS[tabs?.disabledTab?.fontColor ?? "base-content"],
              tabs?.disabledTab?.fontSize,
              tabs?.disabledTab?.fontWeight ?? "font-light",
              BORDER_COLORS[tabs?.disabledTab?.underlineColor ?? "neutral"],
              HOVER_TEXT_COLORS[tabs?.enabledTab?.fontColor ?? "primary"],
              HOVER_FONT_WEIGHT[tabs?.enabledTab?.fontWeight ?? "font-normal"],
              HOVER_BORDER_COLORS[
                tabs?.enabledTab?.underlineColor ?? "primary"
              ],
            )}
          >
            {LANGUAGE_DIFFS[language].productPage.recordTitle}
          </a>
        </div>
        <div class="flex flex-col lg:gap-12">
          {description && (
            <div
              class={clx(
                "bg-white lg:pt-6 max-lg:my-6 max-lg:pt-6",
                productMain?.bgColor === "white" || !productMain?.bgColor
                  ? ""
                  : "lg:px-6 max-lg:px-4",
              )}
            >
              <h2
                className={clx(
                  "text-left",
                  TEXT_COLORS[tabs?.titles?.fontColor ?? "secondary"],
                  tabs?.titles?.fontSize ?? "text-base",
                  tabs?.titles?.fontWeight,
                )}
              >
                {LANGUAGE_DIFFS[language].productPage.descriptionTitle}
              </h2>
              <article
                class={clx(
                  "py-4 font-light text-secondary",
                  "lg:border-b border-base-200",
                  tabs?.productDescription?.descriptionSize ?? "text-sm",
                )}
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
              {propertyCards && propertyCards.length > 0 && (
                <div>
                  <AdditionalPropertyCards
                    propertyCards={propertyCards}
                    mergeQuantity={productMain.mergeQuantity}
                    productDescription={tabs?.productDescription}
                  />
                </div>
              )}
            </div>
          )}
          <div
            class={clx(
              "max-lg:w-screen max-lg:-ml-5 max-lg:bg-white max-lg:px-6 max-lg:pt-4 bg-white lg:py-6",
              productMain?.bgColor === "white" || !productMain?.bgColor
                ? ""
                : "lg:px-6",
            )}
          >
            <h2
              className={clx(
                "pb-6",
                TEXT_COLORS[tabs?.titles?.fontColor ?? "secondary"],
                tabs?.titles?.fontSize ?? "text-base",
                tabs?.titles?.fontWeight,
              )}
              id="properties"
            >
              {LANGUAGE_DIFFS[language].productPage.recordTitle}
            </h2>
            <span class="text-sm text-secondary flex lg:hidden py-2">
              {LANGUAGE_DIFFS[language].productPage.dimensionsProduct}
            </span>
            {hasDimensions && hasDimensionsWithBox && (
              <div className="flex flex-col px-2">
                <div role="tablist" class="tabs border-primary tabs-bordered">
                  <input
                    type="text"
                    disabled
                    value={LANGUAGE_DIFFS[language].productPage
                      .dimensionsProduct}
                    class="tab !text-secondary !bg-transparent !border-0 text-sm px-0 lg:w-48 hidden lg:flex"
                  />
                  <input
                    type="radio"
                    name="my_tabs_2"
                    role="tab"
                    class="tab text-xs text-primary font-light checked:!border-primary"
                    aria-label={LANGUAGE_DIFFS[language].productPage
                      .dimensionsBox}
                    checked={true}
                  />
                  <div
                    role="tabpanel"
                    class="tab-content bg-base-100 rounded-box py-5"
                  >
                    <DimensionsCards
                      additionalProperty={dimensionsProperties}
                    />
                  </div>

                  <input
                    type="radio"
                    name="my_tabs_2"
                    role="tab"
                    class="tab text-xs text-primary font-light checked:!border-primary"
                    aria-label={LANGUAGE_DIFFS[language].productPage.dimensions}
                  />
                  <div
                    role="tabpanel"
                    class="tab-content bg-base-100  rounded-box py-5"
                  >
                    <DimensionsCards
                      additionalProperty={dimensionsPropertiesWithBox}
                    />
                  </div>
                </div>
              </div>
            )}
            {hasTableProperties && (
              <div className="w-full">
                <ul>
                  {tableProperties.map((item, index) => {
                    const { bgColor, descriptionProps, valueProps } =
                      techSheetConfig[index % techSheetConfigSize];
                    return (
                      <li
                        className={clx(
                          "flex justify-between items-center p-2 text-sm",
                          BG_COLORS[bgColor],
                        )}
                      >
                        <span
                          className={clx(
                            descriptionProps.fontWeight,
                            TEXT_COLORS[descriptionProps.fontColor],
                          )}
                        >
                          {`${item.name} `}
                        </span>
                        <span
                          className={clx(
                            valueProps.fontWeight,
                            TEXT_COLORS[valueProps.fontColor],
                          )}
                        >
                          {`${item.value} `}
                          {item.unitText && (`${item.unitText}`)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
