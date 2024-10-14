import type { App, FnContext } from "@deco/deco";

import { PreviewContainer } from "apps/utils/preview.tsx";

import manifest, { Manifest } from "./manifest.gen.ts";

export type AppContext = FnContext<State, Manifest>;

export interface Props {
  language: "EN" | "ES";
}

export interface State extends Omit<Props, "token"> {
}

/**
 * @title App Template
 * @description This is an template of an app to be used as a reference.
 * @category Tools
 * @logo https://
 */
export default function App(props: Props): App<Manifest, State> {
  const state = props;

  return {
    state,
    manifest,
  };
}

// It is important to use the same name as the default export of the app
export const preview = () => {
  return {
    Component: PreviewContainer,
    props: {
      name: "App Template",
      owner: "deco.cx",
      description: "This is an template of an app to be used as a reference.",
      logo:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1/0ac02239-61e6-4289-8a36-e78c0975bcc8",
      images: [],
      tabs: [],
    },
  };
};
