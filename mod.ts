import type { App, FnContext } from "@deco/deco";

import { PreviewContainer } from "apps/utils/preview.tsx";

import manifest, { Manifest } from "./manifest.gen.ts";
import { Secret } from "apps/website/loaders/secret.ts";
import { AppContext as RecordsAppContext } from "apps/records/mod.ts";

export type AppContext = FnContext<State, Manifest> & RecordsAppContext;

export interface Props {
  language: "EN" | "ES";
  siteTemplate: "elux" | "frigidaire";
  originSite?: string;
  actionPassword?: Secret;
}

export type State = Omit<Props, "actionPassword"> & {
  actionPassword: string;
};

/**
 * @title Elux Global Sections
 * @description This app allows you to add global sections to your Elux site.
 * @category Sections
 * @logo https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/12041/b91971a8-b00c-4e0c-9997-14fa3834413a
 */
export default function App(props: Props): App<Manifest, State> {
  const state = props;
  const actionPassword = state.actionPassword?.get() ?? "";

  return {
    state: {
      ...state,
      actionPassword,
    },
    manifest,
  };
}

// It is important to use the same name as the default export of the app
export const preview = () => {
  return {
    Component: PreviewContainer,
    props: {
      name: "Elux Global Sections",
      owner: "deco.cx",
      description: "Use global sections in all Elux sites",
      logo:
        "https://raw.githubusercontent.com/deco-cx/apps/main/ai-assistants/logo.png",
      images: [],
      tabs: [],
    },
  };
};
