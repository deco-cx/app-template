import { useComponent } from "../../sections/Component.tsx";
import { AppContext as BlogContext } from "apps/blog/mod.ts";
import { logger } from "@deco/deco/o11y";
import { clx } from "../../utils/clx.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
import { useToast } from "../../sdk/useToast.ts";

export interface Props {
  itemReviewed: string;
  siteTemplate: "elux" | "frigidaire";
  displayToast?: "success" | "error";
  sectionConfig: CommentSection;
}

export interface CommentSection {
  /**
   * @title Textarea properties
   */
  textareaProps: TextareaProps;
  /**
   * @title Name input properties
   */
  nameInputProps: NameInputProps;
  /**
   * @title Email input properties
   */
  emailInputProps: EmailInputProps;
  /**
   * @title Submit button text
   */
  submitButtonText?: string;
  /**
   * @title Toast properties
   * @description Define the popup toast when the form is submitted
   */
  toastProps?: ToastProps;
}

interface TextareaProps {
  /**
   * @title Label
   */
  label?: string;
  /**
   * @title Placeholder
   */
  placeholder?: string;
  /**
   * @title Max characters count
   */
  maxLength?: number;
  /**
   * @title Max lines count
   */
  maxLines?: number;
}

interface NameInputProps {
  /**
   * @title Label
   */
  label?: string;
  /**
   * @title Placeholder
   */
  placeholder?: string;
  /**
   * @title Required text
   * @description Used when user try to submit without fill this field
   */
  requiredText?: string;
}

interface EmailInputProps {
  /**
   * @title Label
   */
  label?: string;
  /**
   * @title Placeholder
   */
  placeholder?: string;
  /**
   * @title Required text
   * @description Used when user try to submit without fill this field
   */
  requiredText?: string;
  /**
   * @title Extra text
   */
  extraText?: string;
}

interface ToastProps {
  /**
   * @title Success text
   */
  successText?: string;
  /**
   * @title Error text
   */
  errorText?: string;
  /**
   * @title Toast duration
   */
  toastDuration?: number;
}

function handleRequiredField(elementName: string) {
  const field = document.querySelector(
    `[name="${elementName}"]`,
  ) as HTMLInputElement;
  const errorElement = field?.nextElementSibling as HTMLInputElement;

  if (!field && !errorElement) return;

  const isInvalid = !field.value.trim();
  errorElement.checked = isInvalid;
  field.classList.toggle("!border-error", isInvalid);
}

function script(charLimit: number) {
  const form = document.querySelector("form");
  const textarea = document.getElementById("messageTextarea") as
    | HTMLInputElement
    | null;
  const charCountLabel = document.getElementById("charCount");
  const submitButton = document.querySelector('button[type="submit"]');

  //Update char count label
  if (textarea && charCountLabel) {
    textarea.addEventListener("input", function () {
      const currentLength = this.value.length;
      charCountLabel.textContent = `${currentLength}/${charLimit}`;
    });
  }

  //Add submit event prevent in form
  if (form && submitButton) {
    submitButton.addEventListener("click", function (event) {
      if (!validateForm()) {
        event.preventDefault();
      }
    });
  }

  //Validate the form before send
  const validateForm = () => {
    const requiredFields = document.querySelectorAll("[data-required]");
    const allFields = Array.from(requiredFields).reduce((isValid, field) => {
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement
      ) {
        if (!field.value.trim()) {
          showError(field);
          return false;
        }
      } else if (field instanceof HTMLSelectElement) {
        if (field.value === "" || field.value === "default") {
          showError(field);
          return false;
        }
      }
      return isValid;
    }, true);

    return allFields;
  };

  //Show form errors
  const showError = (field: HTMLElement) => {
    const errorElement = field.nextElementSibling as HTMLInputElement;
    if (errorElement && errorElement.type === "radio") {
      errorElement.checked = true;
    }
    field.classList.add("!border-error");
  };
}

export default function SubmitComment(
  props: Props,
) {
  const { siteTemplate, sectionConfig, displayToast } = props;
  const { textareaProps, nameInputProps, emailInputProps, toastProps } =
    sectionConfig;
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  const toast = displayToast
    ? displayToast === "success"
      ? useToast({
        text: toastProps?.successText ??
          "Comentario enviado! Nuestro equipo avalian tu comentario pronto.",
        time: toastProps?.toastDuration ?? 5,
        trigger: "load",
        type: "success",
      })
      : useToast({
        text: toastProps?.errorText ??
          "No se pudo enviar el comentario. Por favor, intenta nuevamente.",
        time: toastProps?.toastDuration ?? 5,
        trigger: "load",
        type: "error",
      })
    : undefined;
  return (
    <div
      {...toast}
    >
      <form
        hx-sync="this:replace"
        hx-trigger="submit"
        hx-target="this"
        hx-indicator="this"
        hx-disabled-elt="this"
        hx-swap="outerHTML"
        hx-post={useComponent<Props>(import.meta.url, {
          ...props,
        })}
      >
        <div class="flex flex-col w-full gap-4 sm:gap-6">
          <div class="form-control">
            <label class={styling.label}>
              {textareaProps.label ?? "Comment*"}
            </label>
            <textarea
              class={clx("textarea w-full", styling.textarea)}
              placeholder={textareaProps.placeholder}
              maxLength={textareaProps.maxLength ?? 200}
              rows={textareaProps.maxLines ?? 4}
              name="message"
              id="messageTextarea"
            >
            </textarea>
            <label
              id="charCount"
              class={clx("self-end", styling.charCount)}
            >
              0/{textareaProps.maxLength ?? 200}
            </label>
          </div>
        </div>
        <div class="flex flex-col gap-4 w-full lg:flex-row">
          <div class="form-control w-full">
            <label class={styling.label}>
              {nameInputProps.label}
            </label>
            <input
              type="text"
              placeholder={nameInputProps.placeholder}
              class={styling.input}
              name="personName"
              data-required
              hx-on:input={useScript(handleRequiredField, "personName")}
            />
            <ErrorComponent
              name={"nameControl"}
              text={nameInputProps.requiredText}
              siteTemplate={siteTemplate}
            />
          </div>
          <div class="form-control w-full">
            <label class={styling.label}>
              {emailInputProps.label}
            </label>
            <input
              type="email"
              placeholder={emailInputProps.placeholder}
              class={styling.input}
              name="personEmail"
              data-required
              hx-on:input={useScript(handleRequiredField, "personEmail")}
            />
            <ErrorComponent
              name={"emailControl"}
              text={emailInputProps.requiredText}
              siteTemplate={siteTemplate}
            />
            <label
              class={clx("self-start", styling.extraText)}
            >
              {emailInputProps.extraText}
            </label>
          </div>
        </div>
        <div class="flex pt-8 sm:pt-4">
          <button
            class={clx("btn btn-ghost w-max self-center", styling.submitButton)}
            type="submit"
          >
            {sectionConfig.submitButtonText ?? "Submit"}
          </button>
        </div>
      </form>

      {
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: useScript(
              script,
              textareaProps.maxLength ?? 200,
            ),
          }}
        />
      }
    </div>
  );
}

function ErrorComponent(
  { name, text = "this field is required", id, siteTemplate }: {
    name: string;
    text?: string;
    id?: string;
    siteTemplate: "elux" | "frigidaire";
  },
) {
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  return (
    <>
      <input
        type="radio"
        class="hidden peer"
        name={name}
        id={id}
      />
      <label
        for={name}
        class={clx(
          "hidden peer-checked:flex flex-row gap-1.5 !text-error items-center",
          styling.extraText,
        )}
      >
        <Icon id="error-frigidaire" size={16} width={16} height={16} />
        <span class="text-xs">
          {text}
        </span>
      </label>
    </>
  );
}

export async function action(props: Props, req: Request, ctx: BlogContext) {
  const formData = await req.formData();
  const reviewBody = formData.get("message")?.toString();
  const userName = formData.get("personName")?.toString();
  const userEmail = formData.get("personEmail")?.toString();
  try {
    await ctx.invoke("blog/actions/submitReview.ts", {
      action: "create",
      additionalType: "submitted",
      reviewBody: reviewBody?.replaceAll("\n", "<br>"),
      itemReviewed: props.itemReviewed,
      isAnonymous: false,
      author: {
        givenName: userName,
        email: userEmail,
      },
    });
  } catch (e) {
    logger.error(e);
    return { ...props, displayToast: "error" };
  }

  return { ...props, displayToast: "success" };
}

const ELUX_STYLING = {
  label: "text-secondary font-light",
  textarea:
    "py-3 px-4 border border-neutral rounded-sm font-light text-secondary placeholder:text-[#868687] focus:border-neutral text-base",
  charCount: "text-secondary font-light text-sm",
  extraText: "text-secondary font-light text-sm mt-1",
  input:
    "border border-neutral rounded-sm px-4 h-12 text-base placeholder:text-success-content text-secondary leading-6",
  submitButton:
    "text-base text-white bg-primary font-medium px-6 rounded-sm hover:bg-warning",
};

const FRIGIDAIRE_STYLING = {
  label: "text-secondary font-medium text-xs",
  textarea:
    "py-3 px-4 border border-neutral rounded-sm font-light text-sm placeholder:text-info text-secondary",
  charCount: "text-secondary font-light text-xs",
  extraText: "text-secondary font-light text-xs",
  input:
    "border border-accent rounded-sm px-4 h-12 text-sm placeholder:text-info text-secondary font-light pt-0.5",
  submitButton:
    "text-sm text-white bg-primary font-medium px-6 rounded-[50px] min-h-10.5 h-10.5 self-center leading-6",
};
