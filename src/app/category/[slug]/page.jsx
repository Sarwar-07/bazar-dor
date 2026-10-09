"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { CATEGORIES, parseBanglaNumber, toBanglaNumber } from "@/lib/utils";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");

  // Find matching category details
  const categoryInfo = CATEGORIES.find((c) => c.id === slug) || {
    id: slug,
    name: slug,
    icon: "🛒",
  };

  useEffect(() => {
    if (!slug) return;

    async function fetchCategoryProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://api.api-store.workers.dev/api/bazardor"}/products?category=${slug}`
        );
        if (!res.ok) throw new Error("Failed to load category products");
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.products || [];
        setProducts(items);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [slug]);

  // Challenge C1: Sort numerically by parsing Bengali price digits
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortOption === "price-asc") {
      return list.sort((a, b) => parseBanglaNumber(a.price) - parseBanglaNumber(b.price));
    }
    if (sortOption === "price-desc") {
      return list.sort((a, b) => parseBanglaNumber(b.price) - parseBanglaNumber(a.price));
    }
    return list; // default ordering
  }, [products, sortOption]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-28" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty State / Invalid category slug
  if (!products.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="text-6xl select-none">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
        </h2>
        <p className="text-sm text-gray-500">
          ক্যাটাগরিটি বর্তমানে খালি অথবা ঠিকানাটি সঠিক নয়।
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Category Header Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
          {categoryInfo.icon}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {categoryInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {toBanglaNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </section>

      {/* Sort Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-end">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs sm:text-sm font-medium text-gray-600">
            সাজান
          </label>
          <div className="relative">
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm font-medium rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="space-y-3">
        <p className="text-xs sm:text-sm text-gray-500">
          মোট {toBanglaNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}