import { TEXT_COLORS } from "../../utils/constants.tsx";
import { clx } from "../../utils/clx.ts";
import { ButtonProps, Colors, TextProps } from "../../utils/types.ts";
import Container, { SpacingConfig } from "../container/Container.tsx";
import ContactFormComponent from "../../components/social/ContactForm.tsx";
import { AppContext } from "../../mod.ts";
import { FontWeight } from "../../utils/types.ts";

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  return {
    language: ctx.language,
    ...props,
  };
};

export interface FormLabelProps extends Omit<TextProps, "text"> {
  fontWeight: FontWeight;
  personalDataLabelColor: Colors;
}

export interface Props {
  title: TextProps;
  description?: TextProps;
  /**
   * @description Styling of the form labels
   */
  formLabels?: FormLabelProps;
  /**
   * @description The list of countries to be displayed in the dropdown
   */
  countries?: string[];
  /**
   * @description The list of subjects to be displayed in the dropdown
   */
  subjects?: string[];
  /**
   * @description Textarea props
   */
  textareaProps?: TextareaProps;
  /**
   * @description Button Props
   */
  buttonProps?: ButtonProps;
  /**
   * @description Error text in form
   */
  errorMessages?: ErrorProps;
  /**
   * @description Spacing config
   */
  spacing: SpacingConfig;
}

export interface TextareaProps {
  textareaRows: number;
  characterLimit: number;
}

export interface ErrorProps {
  /**
   * @description Error when a required field isn`t filled
   */
  requiredFieldText?: string;
  /**
   * @description Error when the email fields have different values
   */
  mustBeEqualEmailField?: string;
}

export default function ContactForm({
  title,
  description,
  spacing,
  countries = [],
  subjects = [],
  textareaProps,
  buttonProps,
  errorMessages,
  language,
  formLabels,
}: ReturnType<typeof loader>) {
  return (
    <Container
      spacing={spacing}
      class="flex flex-col px-6 lg:px-0 container"
    >
      <h1
        class={clx(
          TEXT_COLORS[title.fontColor ?? "primary"],
          title.fontSize,
          title?.fontWeight ?? "font-semibold",
        )}
      >
        {title.text}
      </h1>
      {description && (
        <div
          class={clx(
            "mt-4 lg:mt-6",
            TEXT_COLORS[description.fontColor ?? "primary"],
            description.fontSize,
            description?.fontWeight,
          )}
        >
          <span>{description.text}</span>
        </div>
      )}
      <ContactFormComponent
        countries={countries}
        subjects={subjects}
        textareaProps={textareaProps}
        buttonProps={buttonProps}
        errorMessages={errorMessages}
        language={language}
        formLabels={formLabels}
      />
    </Container>
  );
}
