import { IEvent } from "apps/commerce/types.ts";

export interface NavigationParams {
  menu_location: string;
  menu_button: string;
}

export interface HomeComponentParams {
  component_name: string;
}

export interface ArticleComponentParams {
  article_name: string;
}

export interface ApplyFilterParams {
  filter_option: string;
}

export interface NavigationEvent extends IEvent<NavigationParams> {
  name: "navigation";
}

export interface HomeComponentClickEvent extends IEvent<HomeComponentParams> {
  name: "home_component_click";
}

export interface HomeComponentViewEvent extends IEvent<HomeComponentParams> {
  name: "home_component_view";
}

export interface CardArticleClickEvent extends IEvent<ArticleComponentParams> {
  name: "article_component_click";
}

export interface ArticleViewEvent extends IEvent<ArticleComponentParams> {
  name: "article_component_view";
}

export interface ApplyFilterEvent extends IEvent<ApplyFilterParams> {
  name: "apply_filter";
}
