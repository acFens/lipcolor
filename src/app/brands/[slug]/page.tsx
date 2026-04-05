import { getBrands, getProductsByBrand, getColorFamily } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getBrands().map((b) => ({ slug: b.slug }));
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brands = getBrands();
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    notFound();
  }

  const products = getProductsByBrand(brand.name);
  const allColors = products.flatMap((p) =>
    p.colors.map((c) => ({ ...c, productName: p.name }))
  );

  // Group colors by color family
  const colorsByFamily = new Map<string, typeof allColors>();
  for (const c of allColors) {
    const family = getColorFamily(c.hex);
    const existing = colorsByFamily.get(family) || [];
    existing.push(c);
    colorsByFamily.set(family, existing);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-rose-500">首页</Link>
        <span>/</span>
        <Link href="/brands" className="hover:text-rose-500">品牌</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{brand.name}</span>
      </div>

      {/* Brand Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h1 className="text-3xl font-bold mb-2">{brand.name}</h1>
        <p className="text-gray-500">
          {brand.productCount} 个系列 · {brand.colorCount} 个色号
        </p>

        {/* Full color strip */}
        <div className="flex gap-0.5 mt-4 h-3 rounded-full overflow-hidden">
          {allColors.slice(0, 40).map((c, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>

      {/* Products */}
      {products.map((product, pi) => (
        <div key={pi} className="mb-10">
          <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
          {product.description && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
          )}
          {product.price && (
            <p className="text-sm text-rose-500 mb-4">
              {product.currency === 'GBP' ? '£' : '$'}{product.price}
            </p>
          )}

          {/* Color Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {product.colors.map((color, ci) => (
              <div key={ci} className="group">
                <div
                  className="aspect-square rounded-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 relative cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} ${color.hex}`}
                >
                  {/* Hex tooltip on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs text-center py-1 rounded-b-xl opacity-0 group-hover:opacity-100 transition">
                    {color.hex}
                  </div>
                </div>
                <p className="mt-1.5 text-xs font-medium text-gray-700 text-center truncate">
                  {color.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Color Family Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4">🎨 色系分布</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from(colorsByFamily.entries())
            .sort((a, b) => b[1].length - a[1].length)
            .map(([family, colors]) => (
              <div key={family} className="bg-gray-50 rounded-xl p-4">
                <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-2">
                  {colors.slice(0, 8).map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
                <p className="text-sm font-medium">{family}</p>
                <p className="text-xs text-gray-400">{colors.length} 个色号</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
