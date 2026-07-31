import raw from "./catalog.json";

export type Product = {
  handle: string;
  title: string;
  rawTitle: string;
  brand: string;
  isHouseBrand: boolean;
  departments: string[];
  size: string | null;
  unitsPerCarton: number | null;
  image: string | null;
  description: string;
};

export const products = raw as Product[];

export function productByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}
