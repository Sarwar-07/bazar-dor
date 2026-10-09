import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getBanglaTodayDate, parseBanglaNumber } from "@/lib/utils";

async function getProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://api.api-store.workers.dev/api/bazardor"}/products`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error("Fetch products error:", error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const banglaDate = getBanglaTodayDate();

  // Helper to extract signed numeric change percentage
  const getChangeValue = (item) => {
    const raw = String(item.change || item.changePercent || "0");
    const num = parseFloat(raw.replace(/[^\d.-]/g, "")) || 0;
    if (raw.includes("-") || item.changeType === "down") return -Math.abs(num);
    if (raw.includes("+") || item.changeType === "up") return Math.abs(num);
    return num;
  };

  // Section A: Top 6 Risers (Highest positive change)
  const risers = [...products]
    .filter((p) => getChangeValue(p) > 0)
    .sort((a, b) => getChangeValue(b) - getChangeValue(a))
    .slice(0, 6);

  // Section B: Top 6 Fallers (Steepest negative change)
  const fallers = [...products]
    .filter((p) => getChangeValue(p) < 0)
    .sort((a, b) => getChangeValue(a) - getChangeValue(b))
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
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

        {/* Hero Basket Graphic */}
        <div className="w-64 h-56 sm:w-80 sm:h-64 flex items-center justify-center text-8xl sm:text-9xl bg-emerald-50/60 rounded-3xl shrink-0 select-none">
          🧺
        </div>
      </section>

      {/* Section A: আজ দাম বেড়েছে ▲ */}
      {risers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-rose-600 text-base">▲</span>
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

      {/* Section B: আজ দাম কমেছে ▼ */}
      {fallers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-base">▼</span>
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

      {/* Section C: সব পণ্য */}
      <section id="সব-পণ্য" className="space-y-4 pt-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            সব পণ্য
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            মোট {products.length ? parseBanglaNumber(products.length) : 0}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}