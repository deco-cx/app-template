import { Resolved } from "@deco/deco";
import { Product } from "apps/commerce/types.ts";
import { AppContext } from "../../mod.ts";
import { clx } from "../../utils/clx.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  siteTemplate: "elux" | "frigidaire";
  loader: Resolved<Product[] | null>;
  products?: Product[] | null;
}

export const action = async (
  props: Props,
  req: Request,
  ctx: AppContext,
) => {
  const form = await req.formData();
  const term = form.get("term");

  const { products, loader, ...rest } = props;
  if (products) {
    return { ...rest, products };
  }

  const { __resolveType, ...loaderProps } = loader!;

  // @ts-expect-error This is a dynamic resolved loader
  const productsFromLoader = await ctx.invoke(__resolveType, {
    ...loaderProps,
    term,
  }) as
    | Product[]
    | null;

  return { ...rest, products: productsFromLoader };
};

export default function SearchResult({ siteTemplate, products }: Props) {
  if (!products) {
    return <></>;
  }
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  return (
    <ul class="flex flex-col w-full bg-white" id="search-result">
      {products?.map((p) => (
        <li class={clx(styling.container, "border-x border-b first:border-t")}>
          <LocalProductCard
            product={p}
            siteTemplate={siteTemplate}
          />
        </li>
      ))}
    </ul>
  );
}

function LocalProductCard(
  { product, siteTemplate }: {
    product: Product;
    siteTemplate: "elux" | "frigidaire";
  },
) {
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  const aspectRatio = `${SIZE_PROPS.width} / ${SIZE_PROPS.height}`;
  return (
    <a
      class={clx(
        SIZE_PROPS.container,
        "flex flex-row relative",
      )}
      href={product.url}
    >
      <div class={clx(SIZE_PROPS.imageContainer, "h-full self-center")}>
        {product?.image?.[0]?.url && (
          <Image
            src={product!.image[0]!.url!}
            alt={product.name}
            width={SIZE_PROPS.width}
            height={SIZE_PROPS.height}
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
        <span class={clx(styling.title, SIZE_PROPS.title)}>{product.name}</span>
      </div>
    </a>
  );
}

const ELUX_STYLING = {
  container: "border-[#DEE7EA]",
  gap: "gap-1",
  sku: "text-primary text-base font-light",
  title: "text-secondary text-base font-light",
};

const FRIGIDAIRE_STYLING = {
  container: "border-neutral",
  gap: "gap-0",
  sku: "text-secondary text-sm font-light",
  title: "text-info text-sm font-light",
};

const SIZE_PROPS = {
  width: 64,
  height: 64,
  imageContainer: "min-h-[64px] min-w-[64px]",
  container: "p-2 gap-2",
  title: "line-clamp-2",
};
