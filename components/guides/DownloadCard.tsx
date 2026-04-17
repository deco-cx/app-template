import { PropertyValue } from "apps/commerce/types.ts";
import { clx } from "../../utils/clx.ts";

interface Props {
  property: PropertyValue;
  productID: string;
  siteTemplate: "elux" | "frigidaire";
  downloadButtonText: string;
}

export default function DownloadCard({
  property,
  productID,
  siteTemplate,
  downloadButtonText,
}: Props) {
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  return (
    <div class={clx(styling.border, "flex flex-col", "border rounded")}>
      <div class="pt-5 px-5 pb-6 text-center flex flex-col gap-1">
        <p class={styling.productId}>{productID}</p>
        <p class={styling.propertyName}>{property.name}</p>
      </div>
      <a
        href={property.url}
        class={clx(
          "btn btn-ghost bg-primary text-white h-12 w-full rounded-t-none border-0 border-t",
          styling.border,
          styling.downloadButton,
        )}
        download={`${productID}-${property.name}.pdf`}
      >
        {downloadButtonText}
      </a>
    </div>
  );
}

const ELUX_STYLING = {
  border: "border-base-300",
  productId: "text-secondary text-base font-light",
  propertyName: "text-primary text-base font-semibold",
  downloadButton: "text-base hover:bg-warning-content",
};

const FRIGIDAIRE_STYLING = {
  border: "border-neutral",
  productId: "text-[#848585] text-sm font-light",
  propertyName: "text-secondary text-sm font-semibold",
  downloadButton: "text-sm rounded-b-[3px]",
};
