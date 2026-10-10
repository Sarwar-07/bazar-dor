"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { toBanglaNumber, CATEGORIES } from "@/lib/utils";
import toast from "react-hot-toast";



// Fallback markets matching Figma design if API only provides summary figures
const DEFAULT_MARKETS = [
  { name: "মাঠ বাজার", division: "ময়মনসিংহ", min: "৫৯", max: "৬৫", avg: "৬২" },
  { name: "সদর বাজার", division: "রাজশাহী", min: "৬০", max: "৬৬", avg: "৬৩" },
  { name: "বাজারহাট", division: "খুলনা", min: "৬০", max: "৬৭", avg: "৬৩.৫০" },
  { name: "বাসারহাট বাজার", division: "রাজশাহী", min: "৬০", max: "৬৮", avg: "৬৪" },
  { name: "চৌর বাজার", division: "ময়মনসিংহ", min: "৬০", max: "৬৯", avg: "৬৪.৫০" },
  { name: "আমতলী বাজার", division: "চট্টগ্রাম", min: "৬৪", max: "৬৯", avg: "৬৫" },
  { name: "ডবলগেট বাজার", division: "খুলনা", min: "৬২", max: "৬৯", avg: "৬৫.৫০" },
  { name: "চৌরাস্তা বাজার", division: "সিলেট", min: "৬৩", max: "৭২", avg: "৬৭" },
  { name: "গ্রীন মার্কেট, মিরপুর", division: "ঢাকা", min: "৬৪", max: "৭৫", avg: "৬৭.৫০" },
  { name: "চট্টগ্রাম বাজার", division: "চট্টগ্রাম", min: "৬৩", max: "৭৩", avg: "৬৮" },
  { name: "আমবাজার", division: "সিলেট", min: "৬৪", max: "৭৩", avg: "৬৮.৫০" },
  { name: "কারওয়ান বাজার", division: "ঢাকা", min: "৬৫", max: "৭৩", avg: "৬৯" },
];

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Protected Route Guard: Redirect unauthenticated visitors with toast
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("বিস্তারিত দেখতে অনুগ্রহ করে আগে লগইন করুন");
      router.push("/signin");
    }
  }, [session, isPending, router]);

  // 2. Fetch product details
  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.api-store.workers.dev/api/bazardor";
        
        // Fetch item by id/slug or look up within product catalog
        let res = await fetch(`${baseUrl}/products/${slug}`);
        if (!res.ok) {
          res = await fetch(`${baseUrl}/products`);
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.products || [];
          const found = list.find((p) => String(p.id) === String(slug) || p.slug === slug);
          setProduct(found || null);
          return;
        }

        const data = await res.json();
        setProduct(data.product || data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchProduct();
    }
  }, [slug, session]);

  if (isPending || (loading && session?.user)) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-44 bg-white rounded-3xl border border-gray-100 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          <div className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          <div className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-900">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-medium"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  // Find category Bengali name
  const categoryLabel =
    CATEGORIES.find((c) => c.id === product.category)?.name ||
    product.category ||
    "পণ্য";

  const rawChange = String(product.change || product.changePercent || "0");
  const isUp = rawChange.includes("+") || product.changeType === "up";
  const isDown = rawChange.includes("-") || product.changeType === "down";
  const cleanChange = rawChange.replace(/[+\-%]/g, "").trim();

  const markets = product.markets && product.markets.length > 0 ? product.markets : DEFAULT_MARKETS;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
        <Link href="/" className="hover:text-emerald-700 transition">
          হোম
        </Link>
        <span>›</span>
        <Link
          href={`/category/${product.category || "chal"}`}
          className="hover:text-emerald-700 transition"
        >
          {categoryLabel}
        </Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Main Product Header Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-inner">
            {product.icon || product.emoji || "🍚"}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {product.unit ? (product.unit.startsWith("প্রতি") ? product.unit : `প্রতি ${product.unit}`) : "প্রতি কেজি"} · {categoryLabel}
            </p>
            <p className="text-xs text-gray-500 pt-1">
              গতকালের তুলনায় আজ দাম {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "অপরিবর্তিত"} · {toBanglaNumber(product.diff || "২")} টাকা
            </p>
          </div>
        </div>

        {/* Right Badge: Today's Price */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5 text-right w-full md:w-auto min-w-[180px]">
          <span className="text-xs text-gray-500 block">আজকের দাম</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-0.5">
            {toBanglaNumber(product.price || "৬৬")}
          </div>
          <span className="text-xs text-gray-500 block mt-0.5">
            টাকা / {product.unit?.replace("প্রতি ", "") || "কেজি"}
          </span>
          <span
            className={`text-xs font-semibold mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
              isUp
                ? "bg-rose-50 text-rose-600"
                : isDown
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isUp ? "▲" : isDown ? "▼" : "—"} {toBanglaNumber(cleanChange)}%
          </span>
        </div>
      </section>

      {/* Price Summary Cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-500 block">সর্বনিম্ন দাম</span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">
              {toBanglaNumber(product.minPrice || "৫৯")} টাকা
            </span>
            <span className="text-[11px] text-gray-400 mt-1 block">
              সবচেয়ে কম দামের বাজার
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-500 block">সর্বাধিক দাম</span>
            <span className="text-2xl font-bold text-rose-600 mt-1 block">
              {toBanglaNumber(product.maxPrice || "৭৩")} টাকা
            </span>
            <span className="text-[11px] text-gray-400 mt-1 block">
              সবচেয়ে বেশি দামের বাজার
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-500 block">গড় দাম</span>
            <span className="text-2xl font-bold text-gray-900 mt-1 block">
              {toBanglaNumber(product.avgPrice || product.price || "৬৬")} টাকা
            </span>
            <span className="text-[11px] text-gray-400 mt-1 block">
              {product.unit ? (product.unit.startsWith("প্রতি") ? product.unit : `প্রতি ${product.unit}`) : "প্রতি কেজি"}-এর হিসাবে
            </span>
          </div>
        </div>
      </section>

      {/* Market Breakdown Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400">
                <th className="py-3 px-4">বাজার</th>
                <th className="py-3 px-4">বিভাগ</th>
                <th className="py-3 px-4">সর্বনিম্ন</th>
                <th className="py-3 px-4">সর্বাধিক</th>
                <th className="py-3 px-4 text-right">গড়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {markets.map((market, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4 text-gray-900 font-semibold">{market.name}</td>
                  <td className="py-3.5 px-4 text-gray-500">{market.division}</td>
                  <td className="py-3.5 px-4 text-gray-700">{toBanglaNumber(market.min)} টাকা</td>
                  <td className="py-3.5 px-4 text-gray-700">{toBanglaNumber(market.max)} টাকা</td>
                  <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                    {toBanglaNumber(market.avg)} টাকা
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}