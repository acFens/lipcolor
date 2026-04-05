import { getBrands, getAllProducts, getColorFamily } from '@/lib/data';
import Link from 'next/link';

export default function Home() {
  const brands = getBrands();
  const allProducts = getAllProducts();
  const totalColors = allProducts.reduce((sum, p) => sum + p.colors.length, 0);

  // Get featured colors (one from each hot brand)
  const hotBrands = ['MAC', 'YSL', 'Dior', 'Charlotte Tilbury', 'NARS', 'Chanel', 'Tom Ford', 'Givenchy'];
  const featuredColors = hotBrands
    .map((brand) => {
      const product = allProducts.find((p) => p.brand === brand && p.colors.length > 0);
      if (!product) return null;
      const color = product.colors[0];
      return { brand, product: product.name, color };
    })
    .filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            找到你的
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              完美唇色
            </span>
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            浏览 <span className="font-semibold text-rose-500">{brands.length}</span> 个品牌，
            <span className="font-semibold text-rose-500">{totalColors.toLocaleString()}</span> 个色号
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <Link href="/search">
              <div className="bg-white rounded-full shadow-lg px-6 py-4 flex items-center gap-3 hover:shadow-xl transition cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-400">搜索品牌、色号、颜色...</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Color Swatches */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">✨ 热门色号一览</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {featuredColors.map((item: any, i: number) => (
            <Link key={i} href={`/brands/${item.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
              <div className="group text-center cursor-pointer">
                <div
                  className="w-full aspect-square rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200"
                  style={{ backgroundColor: item.color.hex }}
                />
                <p className="mt-2 text-xs font-medium text-gray-700 truncate">{item.color.name}</p>
                <p className="text-xs text-gray-400">{item.brand}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot Brands */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🔥 热门品牌</h2>
          <Link href="/brands" className="text-rose-500 hover:text-rose-600 text-sm font-medium">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.slice(0, 15).map((brand) => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`}>
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition group">
                {/* Color strip preview */}
                <div className="flex gap-0.5 mb-3 h-2 rounded-full overflow-hidden">
                  {allProducts
                    .filter((p) => p.brand === brand.name)
                    .flatMap((p) => p.colors)
                    .slice(0, 8)
                    .map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
                    ))}
                </div>
                <h3 className="font-semibold text-sm group-hover:text-rose-500 transition">{brand.name}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {brand.productCount} 系列 · {brand.colorCount} 色号
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Brands Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">📋 所有品牌</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {brands.map((brand) => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`}>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md hover:bg-rose-50 transition text-sm">
                <p className="font-medium truncate">{brand.name}</p>
                <p className="text-xs text-gray-400">{brand.colorCount} 色</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
