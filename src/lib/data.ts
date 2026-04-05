import productsData from '@/data/products.json';
import { Product, BrandInfo } from './types';

const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getBrands(): BrandInfo[] {
  const brandMap = new Map<string, { products: number; colors: number }>();
  
  for (const p of products) {
    const existing = brandMap.get(p.brand) || { products: 0, colors: 0 };
    existing.products += 1;
    existing.colors += p.colors.length;
    brandMap.set(p.brand, existing);
  }

  return Array.from(brandMap.entries())
    .map(([name, info]) => ({
      name,
      productCount: info.products,
      colorCount: info.colors,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
    }))
    .sort((a, b) => b.colorCount - a.colorCount);
}

export function getProductsByBrand(brandName: string): Product[] {
  return products.filter(
    (p) => p.brand.toLowerCase() === brandName.toLowerCase()
  );
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return products.filter((p) => {
    if (p.brand.toLowerCase().includes(q)) return true;
    if (p.name.toLowerCase().includes(q)) return true;
    if (p.colors.some((c) => c.name.toLowerCase().includes(q))) return true;
    return false;
  });
}

export function searchColors(query: string): { product: Product; color: { hex: string; name: string } }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: { product: Product; color: { hex: string; name: string } }[] = [];

  for (const p of products) {
    for (const c of p.colors) {
      if (
        c.name.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q)
      ) {
        results.push({ product: p, color: c });
      }
    }
  }

  return results;
}

// Color family classification
export function getColorFamily(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;

  if (l > 0.85) return '裸色/浅色';
  if (l < 0.15) return '深色/暗色';

  let h = 0;
  if (max !== min) {
    const d = max - min;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }

  if (h >= 0 && h < 15) return '红色';
  if (h >= 15 && h < 40) return '橘色/珊瑚';
  if (h >= 40 && h < 60) return '橘色/珊瑚';
  if (h >= 300 && h < 340) return '玫红/紫色';
  if (h >= 340 || h < 0) return '红色';
  if (h >= 280 && h < 300) return '紫色';
  if (h >= 260 && h < 280) return '紫色';

  // Most lip colors fall in the red-pink range
  if (r > g && r > b) {
    if (b > g) return '玫红/紫色';
    return '红色';
  }

  return '其他';
}

export const COLOR_FAMILIES = ['红色', '橘色/珊瑚', '玫红/紫色', '紫色', '裸色/浅色', '深色/暗色', '其他'];
