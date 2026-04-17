import Icon from "./Icon.tsx";
import { clx } from "../../utils/clx.ts";

export interface Props {
  modalId: string;
  siteTemplate: "elux" | "frigidaire";
  modalProps: ModalProps;
}

export interface ModalProps {
  /**
   * @title Modal title
   */
  title: string;
  /**
   * @title Description
   * @format rich-text
   */
  description: string;
  buttonText: string;
}

export default function ModalContent(props: Props) {
  const { modalId, siteTemplate, modalProps } = props;
  const styling = siteTemplate === "elux" ? ELUX_STYLING : FRIGIDAIRE_STYLING;
  return (
    <div id={`div-${modalId}`} class="z-50 w-full px-6 justify-items-center">
      <div
        class={clx(
          "modal-box p-0 border rounded-md",
          "flex flex-col gap-2 lg:gap-6",
          "w-full max-w-[800px]",
          styling.borderColor,
        )}
      >
        {/* Close Btn */}
        <div class="flex flex-row px-4 pt-4 justify-end">
          <label for={modalId} class="cursor-pointer">
            <Icon
              id="close"
              size={24}
              class={styling.closeIconColor}
            />
          </label>
        </div>
        {/* Body */}
        <div class="flex flex-col px-6 pb-12 lg:px-16">
          <p class={styling.titleStyle}>{modalProps.title}</p>
          <div
            class={clx(styling.descriptionStyle, "mb-8 flex flex-col")}
            dangerouslySetInnerHTML={{
              __html: modalProps.description,
            }}
          />
          <label
            for={modalId}
            class={clx(
              "btn btn-ghost",
              "w-full self-center lg:w-auto lg:self-end",
              styling.buttonStyle,
            )}
          >
            <span class="inline">
              {modalProps.buttonText}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

const ELUX_STYLING = {
  borderColor: "border-[#DEE7EA]",
  closeIconColor: "text-primary",
  titleStyle: "text-2xl font-medium pb-6 text-primary lg:text-3.5xl lg:pb-8",
  descriptionStyle: "text-base text-secondary gap-[21px]",
  buttonStyle:
    "bg-primary text-white rounded text-base font-medium hover:bg-warning-content min-h-12 max-h-12 px-6",
};

const FRIGIDAIRE_STYLING = {
  borderColor: "border-base-200",
  closeIconColor: "text-secondary",
  titleStyle: "text-2xl font-semibold pb-6 text-secondary lg:text-3xl lg:pb-8",
  descriptionStyle: "text-sm lg:text-base text-secondary gap-[22px]",
  buttonStyle:
    "bg-primary text-white rounded-[50px] text-sm h-10.5 min-h-10.5 px-11",
};
