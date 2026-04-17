import type { JSX } from "preact";
import { useScript, useScriptAsDataURI } from "@deco/deco/hooks";
import { clx } from "../../utils/clx.ts";
function Dot({ index, ...props }: {
  index: number;
} & JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      data-dot={index}
      aria-label={`go to slider item ${index}`}
      class={clx(
        "focus:outline-none group",
        "bg-base-300 h-2.5 w-2.5 no-animation rounded-full",
        "disabled:bg-primary",
        props.class?.toString(),
      )}
    />
  );
}
function Slider(props: JSX.IntrinsicElements["ul"]) {
  return <ul data-slider {...props} />;
}
function Item({ index, ...props }: JSX.IntrinsicElements["li"] & {
  index: number;
}) {
  return <li data-slider-item={index} {...props} />;
}
function NextButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      disabled
      data-slide="next"
      aria-label="Next item"
      {...props}
    />
  );
}
function PrevButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button disabled data-slide="prev" aria-label="Previous item" {...props} />
  );
}

function SliderCounter(props: JSX.IntrinsicElements["span"]) {
  return <span data-slider-counter {...props} />;
}

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto";
  interval?: number;
  infinite?: boolean;
  goToDisabled?: boolean;
}
const onLoad = (
  { rootId, scroll, interval, infinite, goToDisabled }: Props,
) => {
  function init() {
    // Percentage of the item that has to be inside the container
    // for it it be considered as inside the container
    const THRESHOLD = 0.75;
    const intersectionX = (element: DOMRect, container: DOMRect): number => {
      const delta = container.width / 1000;
      if (element.right < container.left - delta) {
        return 0.0;
      }
      if (element.left > container.right + delta) {
        return 0.0;
      }
      if (element.left < container.left - delta) {
        return element.right - container.left + delta;
      }
      if (element.right > container.right + delta) {
        return container.right - element.left + delta;
      }
      return element.width;
    };
    // as any are ok in typeguard functions
    const isHTMLElement = (x: Element): x is HTMLElement =>
      // deno-lint-ignore no-explicit-any
      typeof (x as any).offsetLeft === "number";
    const root = document.getElementById(rootId);
    const slider = root?.querySelector<HTMLElement>("[data-slider]");
    const items = root?.querySelectorAll<HTMLElement>("[data-slider-item]");
    const prev = root?.querySelector<HTMLElement>('[data-slide="prev"]');
    const next = root?.querySelector<HTMLElement>('[data-slide="next"]');
    const dots = root?.querySelectorAll<HTMLElement>("[data-dot]");
    const dotsDiv = root?.querySelector<HTMLElement>("[data-dots]");
    const counter = root?.querySelector<HTMLElement>("[data-slider-counter]");
    let observer: IntersectionObserver;
    if (!root || !slider || !items || items.length === 0) {
      console.warn(
        "Missing necessary slider attributes. It will not work as intended. Necessary elements:",
        { root, slider, items, rootId },
      );
      return;
    }
    const getElementsInsideContainer = () => {
      const indices: number[] = [];
      const sliderRect = slider.getBoundingClientRect();
      for (let index = 0; index < items.length; index++) {
        const item = items.item(index);
        const rect = item.getBoundingClientRect();
        const ratio = intersectionX(rect, sliderRect) / rect.width;
        if (ratio > THRESHOLD) {
          indices.push(index);
        }
      }
      return indices;
    };
    const getDisabledItems = () =>
      Array.from(items).reduce((acc, i) => {
        if (i.getAttribute("disabled") != undefined) {
          return [...acc, Number(i.getAttribute("data-slider-item")) ?? 0];
        }
        return acc;
      }, [] as Array<number>);
    const goToItem = (to: number, click?: boolean) => {
      const item = items.item(to);
      if (click) {
        item.click();
      }
      if (!isHTMLElement(item)) {
        console.warn(
          `Element at index ${to} is not an html element. Skipping carousel`,
        );
        return;
      }
      slider.scrollTo({
        top: 0,
        behavior: scroll,
        left: item.offsetLeft - slider.offsetLeft - 6,
      });
    };
    const onClickPrev = () => {
      event?.stopPropagation();
      const indices = getElementsInsideContainer();
      // Wow! items per page is how many elements are being displayed inside the container!!
      const itemsPerPage = indices.length;
      const isShowingFirst = indices[0] === 0;
      const pageIndex = Math.floor(indices[indices.length - 1] / itemsPerPage);
      goToItem(
        isShowingFirst ? items.length - 1 : (pageIndex - 1) * itemsPerPage,
      );
    };
    const onClickNext = () => {
      event?.stopPropagation();
      const indices = getElementsInsideContainer();
      // Wow! items per page is how many elements are being displayed inside the container!!
      const itemsPerPage = indices.length;
      const isShowingLast = indices[indices.length - 1] === items.length - 1;
      const pageIndex = Math.floor(indices[0] / itemsPerPage);
      goToItem(
        isShowingLast ? 0 : (pageIndex + 1) * itemsPerPage,
      );
    };
    const updateCounter = (index: number) => {
      if (counter) {
        counter.innerHTML = `${index + 1}/${items.length}`;
      }
    };
    const debounce = (func: () => void, delay: number) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(), delay);
      };
    };
    //Observe Intersection
    const createIntersectionObserver = () => {
      if (observer) {
        observer.disconnect();
      }
      observer = new IntersectionObserver(
        (elements) =>
          elements.forEach((e) => {
            const item = e.target.getAttribute("data-slider-item");
            const index = Number(item) || 0;
            const dot = dots?.item(index);
            if (e.isIntersecting) {
              if (!dot?.classList.contains("hidden")) {
                dots?.forEach((d) => {
                  d?.removeAttribute("disabled");
                  updateCounter(index);
                });
                dot?.setAttribute("disabled", "");
              }
            }
            if (!infinite) {
              if (index === 0) {
                if (e.isIntersecting) {
                  prev?.setAttribute("disabled", "");
                } else {
                  prev?.removeAttribute("disabled");
                }
              }
              if (index === items.length - 1) {
                if (e.isIntersecting) {
                  next?.setAttribute("disabled", "");
                } else {
                  next?.removeAttribute("disabled");
                }
              }
            }
          }),
        { threshold: THRESHOLD, root: slider },
      );
      items.forEach((item) => observer.observe(item));
    };
    //Observe Intersection
    const handleIntersectionObserver = () => {
      const itemsPerPage = getElementsInsideContainer().length;
      //Handle dots div and Prev Next
      if (itemsPerPage === dots?.length) {
        dotsDiv?.classList.add("hidden");
        next?.classList.add("hidden");
        prev?.classList.add("hidden");
      } else {
        dotsDiv?.classList.remove("hidden");
        next?.classList.remove("hidden");
        prev?.classList.remove("hidden");
      }
      //Handle dots
      for (let it = 0; it < (dots?.length ?? 0); it++) {
        if (it % itemsPerPage !== 0) {
          dots?.item(it).classList.add("hidden");
        } else {
          dots?.item(it).classList.remove("hidden");
          dots?.item(it).addEventListener("click", () => goToItem(it));
        }
      }
      createIntersectionObserver();
    };
    prev?.addEventListener("click", onClickPrev);
    next?.addEventListener("click", onClickNext);

    //Use Intersection Observer
    handleIntersectionObserver();
    const debouncedHandleDots = debounce(handleIntersectionObserver, 100);
    globalThis.addEventListener("resize", debouncedHandleDots);

    //Interval
    if (interval) {
      setInterval(onClickNext, interval);
    }
    //Go to disabled item onload
    if (goToDisabled) {
      const disabledItems = getDisabledItems();
      goToItem(disabledItems[0]);
    }
  }
  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
};
function JS(
  {
    rootId,
    scroll = "smooth",
    interval,
    infinite = false,
    goToDisabled = false,
  }: Props,
) {
  return (
    <script
      src={useScriptAsDataURI(onLoad, {
        rootId,
        scroll,
        interval,
        infinite,
        goToDisabled,
      })}
    />
  );
}
Slider.Dot = Dot;
Slider.Item = Item;
Slider.NextButton = NextButton;
Slider.PrevButton = PrevButton;
Slider.JS = JS;
Slider.Counter = SliderCounter;
export default Slider;
