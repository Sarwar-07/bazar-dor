import Link from "next/link";
import { toBanglaNumber } from "@/lib/utils";

export default function ProductCard({ product }) {
  // Determine if price rose, dropped, or remained flat
  const rawChange = String(product.change || product.changePercent || "0");
  const isUp = rawChange.includes("+") || product.changeType === "up" || (!rawChange.includes("-") && parseFloat(rawChange) > 0);
  const isDown = rawChange.includes("-") || product.changeType === "down" || parseFloat(rawChange) < 0;

  // Format clean Bengali percentage string
  const cleanChangeStr = rawChange.replace(/[+\-%]/g, "").trim();
  const banglaChange = toBanglaNumber(cleanChangeStr) || "০.০";

  return (
    <Link
      href={`/product/${product.id || product.slug}`}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
          {product.icon || product.emoji || "🛒"}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {product.unit ? (product.unit.startsWith("প্রতি") ? product.unit : `প্রতি ${product.unit}`) : "প্রতি কেজি"}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-50 flex items-end justify-between">
        <div>
          <span className="text-[11px] text-gray-500 block">আজকের দাম</span>
          <span className="text-lg font-bold text-gray-900">
            {product.price ? toBanglaNumber(product.price) : "—"} টাকা
          </span>
        </div>

        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
            isUp
              ? "bg-rose-50 text-rose-600"
              : isDown
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "—"} {banglaChange}%
        </span>
      </div>
    </Link>
  );
}