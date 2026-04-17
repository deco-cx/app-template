import { Picture, Source } from "apps/website/components/Picture.tsx";
import {
  BG_COLORS,
  GAP_SIZES,
  PADDING_SIZES,
  TEXT_COLORS,
} from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import {
  Colors,
  GapSizes,
  IconProps,
  Image,
  TextProps,
} from "../../utils/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { LoadingFallbackProps } from "@deco/deco";

export interface Props {
  /**
   * @title Background Color
   */
  backgroundColor: Colors;
  /**
   * @title Title
   */
  title: TextProps;
  /**
   * @title Description
   */
  description: Description;
  /**
   * @title Image
   */
  image: Image;
  /**
   * @title Banner link
   */
  link?: Partial<TextProps> & {
    url?: string;
    icon?: IconProps;
    disableUnderline?: boolean;
  };
  /**
   * @title Gap between text
   */
  textGap: GapSizes;
  /**
   * @title Gap between image and text
   */
  imageGap: GapSizes;
  /**
   * @title Use banner in full width
   */
  fullWidth?: boolean;
  /**
   * @title Invert the Image/Text position in desktop
   */
  invertPosition?: boolean;
  /**
   * @title Disable paddings of the text
   */
  disablePaddings?: boolean;
  /**
   * @title Spacing config
   */
  spacing?: SpacingConfig;
}

interface Description extends TextProps {
  /**
   *  @format rich-text
   */
  text: string;
}

export default function Banner(
  {
    backgroundColor,
    title,
    description,
    image,
    link,
    textGap,
    imageGap,
    fullWidth,
    spacing,
    invertPosition,
    disablePaddings,
  }: Props,
) {
  return (
    <Container
      spacing={spacing}
      class={clx(
        !fullWidth ? "container max-sm:px-6" : BG_COLORS[backgroundColor],
      )}
    >
      {/** Container */}
      <div
        class={clx(
          "flex flex-col-reverse container",
          GAP_SIZES[imageGap],
          !fullWidth && BG_COLORS[backgroundColor],
          invertPosition ? "lg:flex-row-reverse" : "lg:flex-row",
        )}
      >
        {/** Text Div */}
        <div
          class={clx(
            "flex flex-col lg:pb-0 self-center",
            GAP_SIZES[textGap],
            !fullWidth && !disablePaddings && (invertPosition
              ? PADDING_SIZES.right[imageGap]
              : PADDING_SIZES.left[imageGap]),
            !disablePaddings && "max-lg:px-6",
            PADDING_SIZES.bottom[imageGap],
          )}
        >
          {/** Title */}
          <p
            class={clx(
              title.fontSize,
              title.fontWeight,
              TEXT_COLORS[title.fontColor],
            )}
          >
            {title.text}
          </p>
          <div
            class={clx(
              description.fontSize,
              description.fontWeight,
              TEXT_COLORS[description.fontColor],
            )}
            dangerouslySetInnerHTML={{ __html: description.text }}
          />
          {link && link.text && (
            <div class="flex flex-row justify-between mt-6.5 sm:mt-2">
              <a
                class={clx(
                  TEXT_COLORS[link?.fontColor ?? "white"],
                  link.fontSize,
                  link.fontWeight,
                  !link?.disableUnderline && "underline",
                )}
                href={link.url}
              >
                {link.text}
              </a>
              {link.icon && link.icon.icon && (
                <Icon
                  id={link.icon.icon}
                  size={link.icon.size}
                  class={clx(TEXT_COLORS[link.icon.color ?? "primary"])}
                />
              )}
            </div>
          )}
        </div>
        {/** Picture Div */}
        <Picture class="h-min">
          <Source
            media="(max-width: 1024px)"
            src={image.mobile.src}
            width={image.mobile.sizing.width ?? 375}
            height={image.mobile.sizing.height ?? 210}
          />
          <Source
            media="(min-width: 1024px)"
            src={image.desktop.src}
            width={image.desktop.sizing.width ?? 510}
            height={image.desktop.sizing.height ?? 300}
          />
          <img
            src={image.desktop.src}
            alt={image.alt}
            class="max-lg:w-full object-cover max-w-none"
          />
        </Picture>
      </div>
    </Container>
  );
}

export const LoadingFallback = (
  { spacing, fullWidth, textGap, invertPosition, imageGap }:
    LoadingFallbackProps<Props>,
) => (
  <Container
    spacing={spacing}
    class={clx(
      !fullWidth && "container max-sm:px-6",
    )}
  >
    <div
      class={clx(
        "flex flex-col-reverse container",
        GAP_SIZES[imageGap ?? 4],
        invertPosition ? "lg:flex-row-reverse" : "lg:flex-row",
      )}
    >
      {/** Title */}
      <div
        class={clx(
          "flex flex-col lg:pb-0 self-center w-full",
          GAP_SIZES[textGap ?? 4],
          !fullWidth && (invertPosition
            ? PADDING_SIZES.right[imageGap ?? 4]
            : PADDING_SIZES.left[imageGap ?? 4]),
          PADDING_SIZES.bottom[imageGap ?? 4],
        )}
      >
        <div class="w-full h-7 sm:h-8 pb-2 skeleton" />
        <div class="w-full h-4 skeleton" />
        <div class="w-full h-4 skeleton" />
      </div>
      {/** Image */}
      <div class="h-[210px] sm:h-[359px] w-full sm:w-[510px] sm:min-w-[510px] sm:min-h-[359px] skeleton" />
    </div>
  </Container>
);
