export interface ColorSwatch {
  hex: string;
  name: string;
}

export interface Product {
  brand: string;
  name: string;
  description: string;
  price: string | null;
  currency: string | null;
  image: string;
  product_link: string;
  category: string;
  colors: ColorSwatch[];
}

export interface BrandInfo {
  name: string;
  productCount: number;
  colorCount: number;
  slug: string;
}
