const FALLBACK_TICKER = [
  { name: "রূপচাঁদা চাল", price: "৭৪", unit: "কেজি", change: "+১.৩%", changeType: "up", icon: "🍚" },
  { name: "চিনিগুড়া চাল", price: "৯৬", unit: "কেজি", change: "-১.১%", changeType: "down", icon: "🍚" },
  { name: "মসুর ডাল", price: "৯২", unit: "কেজি", change: "+২.২%", changeType: "up", icon: "🫘" },
  { name: "সরিষার তেল", price: "১৯৬", unit: "লিটার", change: "+২.৭%", changeType: "up", icon: "🫙" },
  { name: "আলু", price: "৩০", unit: "কেজি", change: "-৩.৭%", changeType: "down", icon: "🥔" },
  { name: "পেঁয়াজ", price: "৭৪", unit: "কেজি", change: "+১.৬%", changeType: "up", icon: "🧅" },
  { name: "কই মাছ", price: "৪৬", unit: "কেজি", change: "+৩.১%", changeType: "up", icon: "🐟" },
  { name: "ডিম", price: "১৫৪", unit: "ডজন", change: "+১.১%", changeType: "up", icon: "🥚" },
];

export default async function PriceTicker() {
  let tickerItems = [];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  try {
    const res = await fetch(`${apiUrl}/products`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.products || [];
      if (items.length > 0) tickerItems = items.slice(0, 10);
    }
  } catch (err) {}

  if (!tickerItems.length) {
    tickerItems = FALLBACK_TICKER;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 overflow-hidden py-2 select-none text-xs text-gray-700">
      <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] gap-8">
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const changeStr = String(item?.change || "");
          const isUp = changeStr.includes("+") || item?.changeType === "up";
          const isDown = changeStr.includes("-") || item?.changeType === "down";

          return (
            <div key={`${item.name || item.id || idx}-${idx}`} className="flex items-center gap-1.5 shrink-0">
              <span>{item.icon || "🛒"}</span>
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="text-gray-600">
                {item.price} টাকা/{item.unit || "কেজি"}
              </span>
              <span
                className={`font-semibold flex items-center ${
                  isUp ? "text-rose-600" : isDown ? "text-emerald-600" : "text-gray-500"
                }`}
              >
                {isUp ? "▲" : isDown ? "▼" : "—"} {changeStr || "০.০%"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}