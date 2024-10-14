import { useComponent } from "../sections/Component.tsx";
import { ToastProps } from "../components/ui/Toast.tsx";
import { TOAST_ID } from "../utils/constants.tsx";

export const useToast = (
  { text, time, trigger, type }: ToastProps & {
    trigger?: "click" | "change" | "load";
  },
): Record<string, string> => {
  return {
    "hx-post": useComponent(
      import.meta.resolve("./../components/ui/Toast.tsx"),
      { text, time, type },
    ),
    "hx-trigger": trigger ?? "click",
    "hx-target": `#${TOAST_ID}`,
    "hx-swap": "innerHTML",
  };
};
