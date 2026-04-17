import { HelpCard as HelpCardType } from "../../sections/Content/HelpCards.tsx";
import Icon from "./Icon.tsx";

type Props = HelpCardType & { siteTemplate: "frigidaire" | "elux" };

export default function HelpCard(
  { title, icon, url, description, siteTemplate }: Props,
) {
  const style = siteTemplate === "frigidaire" ? FRIGIDAIRE_STYLE : ELUX_STYLE;
  return (
    <a
      href={url ?? "#"}
      class="flex flex-row gap-4 h-40 w-full px-6 bg-white rounded items-center"
      data-gtm-element="help-link"
      data-gtm-value={title}
    >
      <div class="min-w-min">
        <Icon id={icon} class="text-primary" height={40} width={40} />
      </div>
      <div class="flex flex-col gap-3">
        <p class={style.titleStyle}>{title}</p>
        {description && <p class={style.descriptionStyle}>{description}</p>}
      </div>
    </a>
  );
}

const ELUX_STYLE = {
  titleStyle: "text-primary text-xl font-medium",
  descriptionStyle: "text-secondary text-base font-light",
};

const FRIGIDAIRE_STYLE = {
  titleStyle: "text-secondary text-xl font-medium",
  descriptionStyle: "text-secondary text-sm font-light",
};
