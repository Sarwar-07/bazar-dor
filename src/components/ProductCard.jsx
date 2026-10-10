import Link from "next/link";

export default function ProductCard({ product }) {
  const isUp = product.changeType === "up" || String(product.change || "").includes("+");
  const isDown = product.changeType === "down" || String(product.change || "").includes("-");

  return (
    <Link
      href={`/product/${product.id || product.slug}`}
      className="group block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon & Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
            {product.icon || "🛒"}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              প্রতি {product.unit || "কেজি"}
            </p>
          </div>
        </div>

        {/* Right: Price & Trend Badge */}
        <div className="text-right shrink-0">
          <p className="text-[11px] text-gray-400 mb-0.5">আজকের গড় দাম</p>
          <div className="flex items-center justify-end gap-2">
            <span className="text-base sm:text-lg font-extrabold text-gray-900">
              {product.price} টাকা
            </span>
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                isUp
                  ? "bg-rose-50 text-rose-600"
                  : isDown
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {isUp ? "▲" : isDown ? "▼" : "—"} {product.change || "০.০%"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}