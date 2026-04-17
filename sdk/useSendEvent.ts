import { AnalyticsEvent } from "apps/commerce/types.ts";
import {
  ApplyFilterEvent,
  ArticleViewEvent,
  CardArticleClickEvent,
  HomeComponentClickEvent,
  HomeComponentViewEvent,
  NavigationEvent,
} from "./types.ts";

export type CustomAnalyticsEvent =
  | AnalyticsEvent
  | NavigationEvent
  | HomeComponentClickEvent
  | HomeComponentViewEvent
  | ArticleViewEvent
  | CardArticleClickEvent
  | ApplyFilterEvent;

export interface Options<E extends CustomAnalyticsEvent> {
  event: E;
  on: "click" | "view" | "change";
}

export const useSendEvent = <E extends CustomAnalyticsEvent>(
  { event, on }: Options<E>,
) => ({
  "data-event": encodeURIComponent(JSON.stringify(event)),
  "data-event-trigger": on,
});
