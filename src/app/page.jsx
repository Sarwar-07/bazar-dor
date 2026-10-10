import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import ProductCard from "@/components/ProductCard";
import { getBanglaTodayDate, toBanglaNumber } from "@/lib/utils";
import { PRODUCTS_DATA } from "@/app/api/products/route";

async function getProducts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  try {
    const res = await fetch(`${apiUrl}/products`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.products || [];
      if (items.length > 0) return items;
    }
  } catch (e) {}

  return PRODUCTS_DATA;
}

export default async function HomePage() {
  await connection();

  const products = await getProducts();
  const banglaDate = getBanglaTodayDate();

  // Top 6 price increases
  const risers = [...products]
    .filter((p) => p.numericChange > 0 || p.changeType === "up")
    .sort((a, b) => (b.numericChange || 0) - (a.numericChange || 0))
    .slice(0, 6);

  // Top 6 price decreases
  const fallers = [...products]
    .filter((p) => p.numericChange < 0 || p.changeType === "down")
    .sort((a, b) => (a.numericChange || 0) - (b.numericChange || 0))
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero / Banner Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <span className="inline-block bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full border border-emerald-100">
            {banglaDate}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <div className="pt-2">
            <a
              href="#সব-পণ্য"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm sm:text-base shadow-sm transition-all"
            >
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        <div className="w-64 h-52 sm:w-80 sm:h-64 relative flex items-center justify-center shrink-0">
          <Image
            src="/bazar-hero.png"
            alt="আজকের বাজারের দাম"
            width={300}
            height={240}
            priority
            className="object-contain drop-shadow-sm"
          />
        </div>
      </section>

      {/* Section 1: আজ দাম বেড়েছে */}
      {risers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-rose-600 text-sm font-bold">▲</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              আজ দাম বেড়েছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {risers.map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Section 2: আজ দাম কমেছে */}
      {fallers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-sm font-bold">▼</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              আজ দাম কমেছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fallers.map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: সব পণ্য */}
      <section id="সব-পণ্য" className="space-y-4 pt-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            সব পণ্য
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            মোট {toBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}