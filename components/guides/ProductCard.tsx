import { Product } from "apps/commerce/types.ts";
import { clx } from "../../utils/clx.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../ui/Icon.tsx";

interface Props {
  product: Product;
  siteTemplate: "elux" | "frigidaire";
  mode?: "small" | "large";
}

export default function ProductCard(
  { product, siteTemplate, mode = "small" }: Props,
) {
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  const sizeProps = mode === "small" ? smallProps : largeProps;
  const aspectRatio = `${sizeProps.width} / ${sizeProps.height}`;
  return (
    <a
      class={clx(
        styling.container,
        sizeProps.container,
        "flex flex-row relative",
      )}
      href={product.url}
    >
      <div class={clx(sizeProps.imageContainer, "h-full self-center")}>
        {product?.image?.[0]?.url && (
          <Image
            src={product!.image[0]!.url!}
            alt={product.name}
            width={sizeProps.width}
            height={sizeProps.height}
            style={{ aspectRatio: aspectRatio }}
            class={clx(
              "object-cover h-full",
            )}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <div class={clx("flex flex-col self-center", styling.gap)}>
        <span class={styling.sku}>{product.productID}</span>
        <span class={clx(styling.title, sizeProps.title)}>{product.name}</span>
      </div>
      {mode === "large" && (
        <div
          class="absolute top-2 right-2 z-10 cursor-pointer"
          hx-on:click="history.back()"
        >
          <Icon
            id="cross-frigidaire"
            class="text-primary"
            width={16}
            height={16}
          />
        </div>
      )}
    </a>
  );
}

const ELUX_STYLING = {
  container: "border-[#DEE7EA] rounded-sm",
  gap: "gap-1",
  sku: "text-secondary text-sm font-light",
  title: "text-primary text-sm font-medium",
};

const FRIGIDAIRE_STYLING = {
  container: "border-neutral rounded-sm",
  gap: "gap-0",
  sku: "text-info text-sm font-light",
  title: "text-secondary text-sm font-medium",
};

const smallProps = {
  width: 64,
  height: 64,
  imageContainer: "min-h-[64px] min-w-[64px]",
  container: "p-2 gap-2 border",
  title: "line-clamp-2",
};

const largeProps = {
  width: 128,
  height: 128,
  imageContainer: "min-h-[128px] min-w-[128px]",
  container:
    "px-4 lg:px-6 py-4 gap-4 lg:gap-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]",
  title: "line-clamp-3",
};
