import { getBrands, getAllProducts } from '@/lib/data';
import Link from 'next/link';

export default function BrandsPage() {
  const brands = getBrands();
  const allProducts = getAllProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">所有品牌</h1>
      <p className="text-gray-500 mb-8">{brands.length} 个品牌，按色号数量排序</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((brand) => {
          const brandProducts = allProducts.filter((p) => p.brand === brand.name);
          const previewColors = brandProducts.flatMap((p) => p.colors).slice(0, 12);

          return (
            <Link key={brand.slug} href={`/brands/${brand.slug}`}>
              <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition group h-full">
                {/* Color swatches preview */}
                <div className="grid grid-cols-6 gap-1 mb-4">
                  {previewColors.map((c, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-md"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  {previewColors.length < 6 &&
                    Array.from({ length: 6 - previewColors.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square rounded-md bg-gray-100" />
                    ))}
                </div>

                <h2 className="text-lg font-semibold group-hover:text-rose-500 transition">
                  {brand.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {brand.productCount} 个系列 · {brand.colorCount} 个色号
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
