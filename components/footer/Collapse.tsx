import { Category, ItemText } from "./Collumn.tsx";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { clx } from "../../utils/clx.ts";

export function Collapse({ items, link, title, isBlank }: Category) {
  const id = useId();

  return (
    <div class="collapse collapse-plus rounded-none border-b border-base-200">
      <input class="hidden peer" type="checkbox" id={id} />

      <label htmlFor={id} class="pb-6 peer-checked:pb-0">
        <div class="collapse-title min-h-0 p-0">
          <div
            class={clx(
              "flex items-center justify-between h-full w-full",
            )}
          >
            <a
              class="font-semibold"
              href={link}
              target={isBlank ? "_blank" : "_self"}
              rel={isBlank ? "noopener noreferrer" : ""}
            >
              <p>{title}</p>
            </a>

            <style
              dangerouslySetInnerHTML={{
                __html: `      
                  #${id}:checked ~ label .arrow { transform: rotate(270deg); transition: transform 0.4s ease; }
                  #${id}:not(:checked) ~ label .arrow { transform: rotate(90deg); transition: transform 0.4s ease; }
                `,
              }}
            />

            <Icon
              id="chevron-right"
              class="ml-auto text-primary arrow pointer-events-none rotate-90"
              stroke="#19191a"
            />
          </div>
        </div>
      </label>

      <div class="collapse-content !p-0">
        <div class="flex flex-col gap-6 py-6">
          {(items as unknown[] as ItemText[]).map((
            { link, title, isBlank },
          ) => (
            <a
              class="text-sm"
              href={link}
              target={isBlank ? "_blank" : "_self"}
              rel={isBlank ? "noopener noreferrer" : ""}
            >
              {title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Collapse;
