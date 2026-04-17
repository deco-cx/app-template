import { Category, ItemText } from "./Collumn.tsx";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { clx } from "../../utils/clx.ts";
import { TEXT_COLORS } from "../../utils/constants.tsx";

export function Collapse({ items, link, title, isBlank, textColor }: Category) {
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
            data-gtm-block-name="footer"
          >
            <a
              class={clx(
                "font-semibold",
                textColor && TEXT_COLORS[textColor],
              )}
              href={link}
              target={isBlank ? "_blank" : "_self"}
              rel={isBlank ? "noopener noreferrer" : ""}
              data-gtm-element="footer-link"
              data-gtm-value={title}
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
        <div class="flex flex-col gap-6 py-6" data-gtm-block-name="footer">
          {(items as unknown[] as ItemText[]).map((
            { link, title, isBlank, fontWeight },
          ) => (
            <a
              class={clx("text-sm", fontWeight)}
              href={link}
              target={isBlank ? "_blank" : "_self"}
              rel={isBlank ? "noopener noreferrer" : ""}
              data-gtm-element="footer-link"
              data-gtm-value={title}
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
