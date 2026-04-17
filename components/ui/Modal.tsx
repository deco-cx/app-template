import { ComponentChildren } from "preact";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
import Icon from "./Icon.tsx";
interface Props {
  open?: boolean;
  children?: ComponentChildren;
  id?: string;
}
const script = (id: string) => {
  const handler = (e: KeyboardEvent) => {
    if (e.key !== "Escape" && e.keyCode !== 27) {
      return;
    }
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (!input) {
      return;
    }
    input.checked = false;
  };
  addEventListener("keydown", handler);
};

function Modal({ children, open, id = useId() }: Props) {
  return (
    <>
      <input id={id} checked={open} type="checkbox" class="modal-toggle" />
      <div class="modal !bg-white flex flex-col px-4">
        <label
          class="modal-backdrop text-black flex justify-end h-16 items-center w-fit ml-auto cursor-pointer"
          for={id}
        >
          <Icon id="close" class="rotate-180 text-primary" size={32} />
        </label>
        {children}
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(script, id) }}
      />
    </>
  );
}
export default Modal;
