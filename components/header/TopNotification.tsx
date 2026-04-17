import Slider from "../ui/Slider.tsx";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
import { clx } from "../../utils/clx.ts";
import { BG_COLORS, TEXT_COLORS } from "../../utils/constants.tsx";
import type { Colors } from "../../utils/types.ts";

export const TOP_NOTIFICATION_HEIGHT = "28px";
const AUTOPLAY_INTERVAL_MS = 4000;

export interface TopNotificationItem {
  /**
   * @title Texto
   */
  text?: string;
  /**
   * @title Link
   */
  link?: string;
}

export interface TopNotificationProps {
  /**
   * @title Ativa
   * @description Se true, a notificação superior é exibida.
   */
  active?: boolean;
  /**
   * @title Itens da notificação
   * @description Lista de textos (1..N) com seus respectivos links.
   * @minItems 1
   */
  items: TopNotificationItem[];
  /**
   * @title Cor de fundo
   */
  backgroundColor: Colors;
  /**
   * @title Cor do texto
   */
  textColor: Colors;
  /**
   * @title Chave de persistencia
   * @description Chave do localStorage para manter a notificacao fechada para o usuario.
   */
  storageKey?: string;
}

type Props = TopNotificationProps & { closeId?: string };

const setupTopNotificationDismiss = (
  { closeId, storageKey }: { closeId: string; storageKey: string },
) => {
  const input = document.getElementById(closeId) as HTMLInputElement | null;
  if (!input) return;

  let isDismissed = false;
  try {
    isDismissed = localStorage.getItem(storageKey) === "true";
  } catch {
    // Ignore storage errors (private mode, blocked access, etc).
  }
  input.checked = isDismissed;
  input.dataset.ready = "true";

  input.addEventListener("change", () => {
    try {
      if (input.checked) {
        localStorage.setItem(storageKey, "true");
      }
    } catch {
      // Ignore storage errors.
    }
  });
};

export default function TopNotification({
  active,
  items,
  backgroundColor,
  textColor,
  storageKey = "header-top-notification-dismissed",
  closeId,
}: Props) {
  const rootId = "header-top-notification-slider";
  const internalCloseId = "header-top-notification-close";
  const finalCloseId = closeId ?? internalCloseId;

  if (!active || items.length === 0) return null;

  return (
    <>
      {!closeId && (
        <input id={internalCloseId} type="checkbox" class="peer hidden" />
      )}
      <div
        class={clx(
          "fixed left-0 top-0 w-full z-50",
        )}
      >
        <div
          class={clx(
            BG_COLORS[backgroundColor],
            "h-[28px] flex items-center justify-center relative",
            "px-6 overflow-hidden",
          )}
          style={{ height: TOP_NOTIFICATION_HEIGHT }}
        >
          <div id={rootId} class="w-full h-full overflow-hidden">
            <Slider
              class={clx(
                "flex flex-nowrap overflow-x-hidden h-full",
              )}
            >
              {items.map((item, index) => (
                <Slider.Item
                  index={index}
                  class="flex-none w-full h-full"
                >
                  <a
                    href={item.link}
                    class={clx(
                      TEXT_COLORS[textColor],
                      "h-full flex items-center justify-center",
                      "text-sm font-medium",
                    )}
                  >
                    <span class="block overflow-hidden whitespace-nowrap text-ellipsis">
                      {item.text}
                    </span>
                  </a>
                </Slider.Item>
              ))}
            </Slider>
            <Slider.JS
              rootId={rootId}
              infinite
              interval={items.length > 1 ? AUTOPLAY_INTERVAL_MS : undefined}
            />
          </div>

          <label
            for={finalCloseId}
            aria-label="Fechar notificação"
            class={clx(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "cursor-pointer",
              TEXT_COLORS[textColor],
            )}
          >
            <Icon id="close" size={16} class="text-current" />
          </label>
        </div>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(setupTopNotificationDismiss, {
            closeId: finalCloseId,
            storageKey,
          }),
        }}
      />
    </>
  );
}

