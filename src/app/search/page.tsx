'use client';

import { useState, useMemo } from 'react';
import { getAllProducts, getColorFamily, COLOR_FAMILIES } from '@/lib/data';
import type { Product } from '@/lib/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  const allProducts = useMemo(() => getAllProducts(), []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    let matches: { product: Product; color: { hex: string; name: string } }[] = [];

    for (const p of allProducts) {
      for (const c of p.colors) {
        const matchesQuery =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.hex.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q);

        const matchesFamily =
          !selectedFamily || getColorFamily(c.hex) === selectedFamily;

        if (matchesQuery && matchesFamily) {
          matches.push({ product: p, color: c });
        }
      }
    }

    return matches.slice(0, 200);
  }, [query, selectedFamily, allProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔍 搜索色号</h1>

      {/* Search Input */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入品牌名、色号名、HEX色值..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-lg"
            autoFocus
          />
        </div>

        {/* Color Family Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setSelectedFamily(null)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              !selectedFamily
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {COLOR_FAMILIES.map((family) => (
            <button
              key={family}
              onClick={() => setSelectedFamily(selectedFamily === family ? null : family)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                selectedFamily === family
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {family}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {results.length === 200 ? '显示前 200 个结果' : `${results.length} 个结果`}
      </p>

      {/* Results Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {results.map((item, i) => (
          <div key={i} className="group">
            <div
              className="aspect-square rounded-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 relative cursor-pointer"
              style={{ backgroundColor: item.color.hex }}
            >
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] text-center py-1 rounded-b-xl opacity-0 group-hover:opacity-100 transition">
                {item.color.hex}
              </div>
            </div>
            <p className="mt-1 text-xs font-medium text-gray-700 text-center truncate">
              {item.color.name}
            </p>
            <p className="text-[10px] text-gray-400 text-center truncate">
              {item.product.brand}
            </p>
          </div>
        ))}
      </div>

      {results.length === 0 && query && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">💄</p>
          <p>没有找到匹配的色号</p>
          <p className="text-sm mt-1">试试换个关键词？</p>
        </div>
      )}

      {!query && !selectedFamily && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p>输入关键词开始搜索</p>
          <p className="text-sm mt-1">支持搜索品牌名、色号名、HEX 色值</p>
        </div>
      )}
    </div>
  );
}
