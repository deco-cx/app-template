import { AppContext } from "../../mod.ts";
import { clx } from "../../utils/clx.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";

export interface Props {
  /**
   * @title Text
   * @format rich-text
   */
  text: string;
  /**
   * @title Spacing configuration
   */
  spacingConfig?: SpacingConfig;
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  return {
    ...props,
    siteTemplate: ctx.siteTemplate,
    url: req.url,
  };
};

export default function GuidesCategories(props: ReturnType<typeof loader>) {
  const styling = props.siteTemplate === "elux"
    ? ELUX_STYLING
    : FRIGIDAIRE_STYLING;
  return (
    <Container spacing={props.spacingConfig} class="container max-sm:px-6">
      <div
        class={clx(styling.description)}
        dangerouslySetInnerHTML={{ __html: props.text }}
      />
    </Container>
  );
}

const ELUX_STYLING = {
  description: "text-secondary text-sm font-normal",
};

const FRIGIDAIRE_STYLING = {
  description: "text-secondary text-sm font-thin",
};
