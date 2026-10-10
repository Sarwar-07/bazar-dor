"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { CATEGORIES, parseBanglaNumber, toBanglaNumber } from "@/lib/utils";

const CATEGORY_FALLBACK_PRODUCTS = [
  { id: "1", slug: "miniket-rice", name: "মিনিকেট চাল", category: "chal", price: "৬৮", change: "+২.৫%", changeType: "up", unit: "কেজি", icon: "🍚", minPrice: "৬৫", maxPrice: "৭২", avgPrice: "৬৮" },
  { id: "2", slug: "nazirshail-rice", name: "নাজিরশাইল চাল", category: "chal", price: "৭৫", change: "+১.২%", changeType: "up", unit: "কেজি", icon: "🌾", minPrice: "৭২", maxPrice: "৭৮", avgPrice: "৭৫" },
  { id: "3", slug: "moshoor-dal", name: "মসুর ডাল (দেশি)", category: "dal", price: "১৩০", change: "-২.০%", changeType: "down", unit: "কেজি", icon: "🫘", minPrice: "১২৫", maxPrice: "১৩৫", avgPrice: "১৩০" },
  { id: "4", slug: "mug-dal", name: "মুগ ডাল", category: "dal", price: "১৪৫", change: "+৩.০%", changeType: "up", unit: "কেজি", icon: "🍲", minPrice: "১৪০", maxPrice: "১৫০", avgPrice: "১৪৫" },
  { id: "5", slug: "soyabean-oil", name: "সয়াবিন তেল (বোতলজাত)", category: "tel", price: "১৮৮", change: "-১.৫%", changeType: "down", unit: "লিটার", icon: "🫙", minPrice: "১৮৫", maxPrice: "১৯২", avgPrice: "১৮৮" },
  { id: "6", slug: "sorisha-oil", name: "সরিষার তেল", category: "tel", price: "৩২০", change: "০.০%", changeType: "flat", unit: "লিটার", icon: "🌻", minPrice: "৩১০", maxPrice: "৩৩০", avgPrice: "৩২০" },
  { id: "7", slug: "alu", name: "আলু (হল্যান্ড)", category: "sobji", price: "৫৫", change: "-৫.২%", changeType: "down", unit: "কেজি", icon: "🥔", minPrice: "৫০", maxPrice: "৬০", avgPrice: "৫৫" },
  { id: "8", slug: "peyaj", name: "দেশি পেঁয়াজ", category: "sobji", price: "১১০", change: "+৮.৫%", changeType: "up", unit: "কেজি", icon: "🧅", minPrice: "১০৫", maxPrice: "১২০", avgPrice: "১১০" },
  { id: "9", slug: "begun", name: "গোল বেগুন", category: "sobji", price: "৭০", change: "-৪.০%", changeType: "down", unit: "কেজি", icon: "🍆", minPrice: "৬৫", maxPrice: "৭৫", avgPrice: "৭০" },
  { id: "10", slug: "rui-fish", name: "রুই মাছ", category: "mach", price: "৩৪০", change: "+৪.৫%", changeType: "up", unit: "কেজি", icon: "🐟", minPrice: "৩২০", maxPrice: "৩৬০", avgPrice: "৩৪০" },
  { id: "11", slug: "ilish-fish", name: "ইলিশ মাছ (১ কেজি)", category: "mach", price: "১৬৫০", change: "-৩.০%", changeType: "down", unit: "কেজি", icon: "🐠", minPrice: "১৬০০", maxPrice: "১৭০০", avgPrice: "১৬৫০" },
  { id: "12", slug: "broiler-chicken", name: "ব্রয়লার মুরগি", category: "mangsho", price: "১৭৫", change: "-৬.০%", changeType: "down", unit: "কেজি", icon: "🍗", minPrice: "১৭০", maxPrice: "১৮৫", avgPrice: "১৭৫" },
  { id: "13", slug: "beef", name: "গরুর মাংস", category: "mangsho", price: "৭৫০", change: "০.০%", changeType: "flat", unit: "কেজি", icon: "🥩", minPrice: "৭৪০", maxPrice: "৭৬০", avgPrice: "৭৫০" },
  { id: "14", slug: "farm-egg", name: "ফার্মের ডিম", category: "dim-dudh", price: "১৪৫", change: "+৬.২%", changeType: "up", unit: "ডজন", icon: "🥚", minPrice: "১৪০", maxPrice: "১৫০", avgPrice: "১৪৫" },
  { id: "15", slug: "shuddho-dudh", name: "খাঁটি তরল দুধ", category: "dim-dudh", price: "৮৫", change: "০.০%", changeType: "flat", unit: "লিটার", icon: "🥛", minPrice: "৮০", maxPrice: "৯০", avgPrice: "৮৫" },
  { id: "16", slug: "dry-chilli", name: "শুকনা মরিচ", category: "moshla", price: "৪২০", change: "+২.০%", changeType: "up", unit: "কেজি", icon: "🌶️", minPrice: "৪০০", maxPrice: "৪৪০", avgPrice: "৪২০" },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug ? String(params.slug).toLowerCase() : "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");

  const categoryInfo = CATEGORIES.find(
    (c) => (c.id && c.id.toLowerCase() === slug) || (c.slug && c.slug.toLowerCase() === slug)
  ) || {
    id: slug,
    name: slug,
    icon: "🛒",
  };

  useEffect(() => {
    if (!slug) return;

    async function fetchCategoryProducts() {
      setLoading(true);
      try {
        // Use relative path to avoid browser CORS issues
        const res = await fetch(`/api/products?category=${slug}`);
        if (!res.ok) throw new Error("API request failed");
        
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.products || [];
        
        if (items.length > 0) {
          setProducts(items);
        } else {
          // If empty, match from fallback
          const fallback = CATEGORY_FALLBACK_PRODUCTS.filter(
            (p) => p.category.toLowerCase() === slug
          );
          setProducts(fallback);
        }
      } catch (error) {
        // Safe graceful fallback on CORS or network error
        const fallback = CATEGORY_FALLBACK_PRODUCTS.filter(
          (p) => p.category.toLowerCase() === slug
        );
        setProducts(fallback);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortOption === "price-low") {
      return list.sort((a, b) => (parseBanglaNumber(a.price) || 0) - (parseBanglaNumber(b.price) || 0));
    }
    if (sortOption === "price-high") {
      return list.sort((a, b) => (parseBanglaNumber(b.price) || 0) - (parseBanglaNumber(a.price) || 0));
    }
    return list;
  }, [products, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-emerald-700">হোম</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{categoryInfo.name}</span>
      </div>

      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span>{categoryInfo.icon}</span>
            <span>{categoryInfo.name}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            মোট {toBanglaNumber(sortedProducts.length)}টি পণ্য পাওয়া গেছে
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
            সর্ট করুন:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-800"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-low">দাম: কম থেকে বেশি</option>
            <option value="price-high">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4">
          <div className="text-5xl">🔍</div>
          <h2 className="text-xl font-bold text-gray-800">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
          </h2>
          <p className="text-sm text-gray-500">
            ক্যাটাগরিটি বর্তমানে খালি অথবা ঠিকানাটি সঠিক নয়।
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-medium transition-all"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}