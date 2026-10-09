export default async function PriceTicker() {
  let tickerItems = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "https://api.api-store.workers.dev/api/bazardor"}/products`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    tickerItems = (Array.isArray(data) ? data : data.products || []).slice(0, 10);
  } catch (err) {
    tickerItems = [];
  }

  if (!tickerItems.length) return null;

  return (
    <div className="bg-gray-50 border-b border-gray-200 overflow-hidden py-2 select-none text-xs text-gray-700">
      <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] gap-8">
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const isUp = item.change?.includes("+") || item.changeType === "up";
          const isDown = item.change?.includes("-") || item.changeType === "down";

          return (
            <div key={`${item.id || item.slug}-${idx}`} className="flex items-center gap-1.5 shrink-0">
              <span>{item.icon || "🛒"}</span>
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="text-gray-600">{item.price} টাকা/{item.unit || "কেজি"}</span>
              <span
                className={`font-semibold flex items-center ${
                  isUp ? "text-emerald-600" : isDown ? "text-rose-600" : "text-gray-500"
                }`}
              >
                {isUp ? "▲" : isDown ? "▼" : "—"} {item.change || "০.০%"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}