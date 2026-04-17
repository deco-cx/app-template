import { Head } from "$fresh/runtime.ts";
import { useScript } from "@deco/deco/hooks";
import { usePageContext as useDecoPageContext } from "@deco/deco";
import { pageIdFromMetadata } from "apps/website/pages/Page.tsx";

function script(
  pageId: string,
) {
  const pushToDataLayer = () => {
    const data = { event: "page_view", "content_group": pageId };

    // @ts-ignore globalThis is defined
    globalThis.dataLayer = globalThis.dataLayer || [];
    // @ts-ignore dataLayer is defined
    globalThis.dataLayer.push(data);
  };

  if (document.readyState === "complete") {
    pushToDataLayer();
  } else {
    globalThis.addEventListener("load", pushToDataLayer);
  }
}

export default function PageView() {
  const metadata = useDecoPageContext()?.metadata;
  const pageId = pageIdFromMetadata(metadata);
  return (
    <Head>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            script,
            String(pageId),
          ),
        }}
      />
    </Head>
  );
}
