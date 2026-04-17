import { Product } from "apps/commerce/types.ts";
import { productsMock } from "../utils/mocks/product.ts";

export interface Props {
  itemsQuantity?: number;
}

export default function loader({ itemsQuantity = 8 }: Props): Product[] | null {
  const randomProducts: Product[] = [];

  for (let i = 0; i < itemsQuantity; i++) {
    const randomIndex = Math.floor(Math.random() * productsMock.length);
    randomProducts.push(productsMock[randomIndex]);
  }

  return randomProducts;
}
