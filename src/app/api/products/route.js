import { NextResponse } from "next/server";

const PRIMARY_API_URL = "https://api.api-store.workers.dev/api/bazardor";

// Full 33 products baseline dataset matching reference design
export const PRODUCTS_DATA = [
  // চাল (Chal)
  { id: "1", slug: "rupchanda-rice", name: "রূপচাঁদা চাল", category: "chal", price: "৭৪", change: "+১.৩%", changeType: "up", unit: "কেজি", icon: "🍚", minPrice: "৭২", maxPrice: "৭৬", avgPrice: "৭৪", diff: "১" },
  { id: "2", slug: "chinigura-rice", name: "চিনিগুড়া চাল", category: "chal", price: "৯৬", change: "-১.১%", changeType: "down", unit: "কেজি", icon: "🍚", minPrice: "৯২", maxPrice: "১০০", avgPrice: "৯৬", diff: "১" },
  { id: "3", slug: "nazir-rice", name: "নাজির চাল", category: "chal", price: "৫৩", change: "০.০%", changeType: "flat", unit: "কেজি", icon: "🍚", minPrice: "৫০", maxPrice: "৫৫", avgPrice: "৫৩", diff: "০" },
  { id: "4", slug: "packet-aush-rice", name: "প্যাকেট আউশ চাল", category: "chal", price: "৫৩", change: "+৩.২%", changeType: "up", unit: "কেজি", icon: "🌾", minPrice: "৫০", maxPrice: "৫৬", avgPrice: "৫৩", diff: "২" },

  // ডাল (Dal)
  { id: "5", slug: "moshoor-dal", name: "মসুর ডাল", category: "dal", price: "৯২", change: "+২.২%", changeType: "up", unit: "কেজি", icon: "🫘", minPrice: "৮৮", maxPrice: "৯৫", avgPrice: "৯২", diff: "২" },
  { id: "6", slug: "chola", name: "ছোলা", category: "dal", price: "১২০", change: "-২.৪%", changeType: "down", unit: "কেজি", icon: "🫘", minPrice: "১১৫", maxPrice: "১২৫", avgPrice: "১২০", diff: "৩" },

  // তেল (Tel)
  { id: "7", slug: "soyabean-teer", name: "সয়াবিন তেল (তীর)", category: "tel", price: "১৫৩", change: "+১.৩%", changeType: "up", unit: "লিটার", icon: "🫙", minPrice: "১৫০", maxPrice: "১৫৮", avgPrice: "১৫৩", diff: "২" },
  { id: "8", slug: "sorisha-oil", name: "সরিষার তেল", category: "tel", price: "১৯৬", change: "+২.৭%", changeType: "up", unit: "লিটার", icon: "🫙", minPrice: "১৯০", maxPrice: "২০২", avgPrice: "১৯৬", diff: "৫" },
  { id: "9", slug: "palm-oil", name: "পাম তেল", category: "tel", price: "১৯৬", change: "-২.১%", changeType: "down", unit: "লিটার", icon: "🫙", minPrice: "১৯০", maxPrice: "২০০", avgPrice: "১৯৬", diff: "৪" },
  { id: "10", slug: "hati-marka-sorisha", name: "হাতি মার্কা সরিষার তেল", category: "tel", price: "১১২", change: "+৭.১%", changeType: "up", unit: "লিটার", icon: "🫙", minPrice: "১০৫", maxPrice: "১২০", avgPrice: "১১২", diff: "৭" },
  { id: "11", slug: "surjo-oil", name: "সূর্য তেল", category: "tel", price: "১৯৬", change: "০.০%", changeType: "flat", unit: "লিটার", icon: "🌻", minPrice: "১৯০", maxPrice: "২০০", avgPrice: "১৯৬", diff: "০" },

  // সবজি (Sobji)
  { id: "12", slug: "alu", name: "আলু", category: "sobji", price: "৩০", change: "-৩.৭%", changeType: "down", unit: "কেজি", icon: "🥔", minPrice: "২৮", maxPrice: "৩৪", avgPrice: "৩০", diff: "১" },
  { id: "13", slug: "peyaj", name: "পেঁয়াজ", category: "sobji", price: "৭৪", change: "+১.৬%", changeType: "up", unit: "কেজি", icon: "🧅", minPrice: "৭০", maxPrice: "৭৮", avgPrice: "৭৪", diff: "১" },
  { id: "14", slug: "kancha-morich", name: "কাঁচামরিচ", category: "sobji", price: "৬২", change: "-১.৪%", changeType: "down", unit: "কেজি", icon: "🌶️", minPrice: "৫৮", maxPrice: "৬৫", avgPrice: "৬২", diff: "১" },
  { id: "15", slug: "begun", name: "বেগুন", category: "sobji", price: "৪৪", change: "+১.৬%", changeType: "up", unit: "কেজি", icon: "🍆", minPrice: "৪০", maxPrice: "৪৮", avgPrice: "৪৪", diff: "১" },
  { id: "16", slug: "tomato", name: "টমেটো", category: "sobji", price: "৩৮", change: "০.০%", changeType: "flat", unit: "কেজি", icon: "🍅", minPrice: "৩৫", maxPrice: "৪০", avgPrice: "৩৮", diff: "০" },

  // মাছ (Mach)
  { id: "17", slug: "koi-fish", name: "কই মাছ", category: "mach", price: "৪৬", change: "+৩.১%", changeType: "up", unit: "কেজি", icon: "🐟", minPrice: "৪২", maxPrice: "৫০", avgPrice: "৪৬", diff: "১" },
  { id: "18", slug: "telapia-fish", name: "তেলাপিয়া", category: "mach", price: "৩৬", change: "০.০%", changeType: "flat", unit: "কেজি", icon: "🐟", minPrice: "৩৪", maxPrice: "৩৮", avgPrice: "৩৬", diff: "০" },
  { id: "19", slug: "ilish-fish", name: "ইলিশ মাছ", category: "mach", price: "১,৪২০", change: "+৩.৪%", changeType: "up", unit: "কেজি", icon: "🐟", minPrice: "১,৩৮০", maxPrice: "১,৪৬০", avgPrice: "১,৪২০", diff: "৪০" },
  { id: "20", slug: "carp-fish", name: "কার্প জাতীয় মাছ", category: "mach", price: "৪৩", change: "-৫.২%", changeType: "down", unit: "কেজি", icon: "🐟", minPrice: "৪০", maxPrice: "৪৭", avgPrice: "৪৩", diff: "২" },
  { id: "21", slug: "chingri-fish", name: "চিংড়ি মাছ (ছোট)", category: "mach", price: "৩৩০", change: "+১১.২%", changeType: "up", unit: "কেজি", icon: "🦐", minPrice: "৩০০", maxPrice: "৩৬০", avgPrice: "৩৩০", diff: "৩০" },

  // মাংস (Mangsho)
  { id: "22", slug: "murgir-mangsho", name: "মুরগির মাংস", category: "mangsho", price: "২২৭", change: "-১.২%", changeType: "down", unit: "কেজি", icon: "🍗", minPrice: "২২০", maxPrice: "২৩৫", avgPrice: "২২৭", diff: "৩" },
  { id: "23", slug: "gorur-mangsho", name: "গরুর মাংস", category: "mangsho", price: "৭৯০", change: "-২.১%", changeType: "down", unit: "কেজি", icon: "🥩", minPrice: "৭৭৫", maxPrice: "৮০০", avgPrice: "৭৯০", diff: "১৫" },
  { id: "24", slug: "khasir-mangsho", name: "খাসির মাংস", category: "mangsho", price: "১,২৯০", change: "-০.৮%", changeType: "down", unit: "কেজি", icon: "🥩", minPrice: "১,২৬০", maxPrice: "১,৩২০", avgPrice: "১,২৯০", diff: "১০" },
  { id: "25", slug: "hasher-mangsho", name: "হাঁসের মাংস", category: "mangsho", price: "২৮২", change: "-৩.৪%", changeType: "down", unit: "কেজি", icon: "🦆", minPrice: "২৭০", maxPrice: "২৯৫", avgPrice: "২৮২", diff: "১০" },

  // ডিম ও দুধ (Dim-Dudh)
  { id: "26", slug: "dim", name: "ডিম", category: "dim-dudh", price: "১৫৪", change: "+১.১%", changeType: "up", unit: "ডজন", icon: "🥚", minPrice: "১৫০", maxPrice: "১৬০", avgPrice: "১৫৪", diff: "২" },
  { id: "27", slug: "dudh", name: "দুধ", category: "dim-dudh", price: "১০২", change: "+৬.১%", changeType: "up", unit: "লিটার", icon: "🥛", minPrice: "৯৫", maxPrice: "১১০", avgPrice: "১০২", diff: "৬" },
  { id: "28", slug: "ghee", name: "ঘি", category: "dim-dudh", price: "৯২", change: "০.০%", changeType: "flat", unit: "লিটার", icon: "🧈", minPrice: "৮৮", maxPrice: "৯৬", avgPrice: "৯২", diff: "০" },

  // মসলা (Moshla)
  { id: "29", slug: "chips", name: "চিপস (৭০০ গ্রাম)", category: "moshla", price: "১৪৫", change: "+১.৪%", changeType: "up", unit: "প্যাকেট", icon: "🍟", minPrice: "১৪০", maxPrice: "১৫০", avgPrice: "১৪৫", diff: "২" },
  { id: "30", slug: "ada", name: "আদা", category: "moshla", price: "১৮৭", change: "+১.৩%", changeType: "up", unit: "কেজি", icon: "🫚", minPrice: "১৮০", maxPrice: "১৯৫", avgPrice: "১৮৭", diff: "২" },
  { id: "31", slug: "roshun", name: "রসুন", category: "moshla", price: "১২৫", change: "-৭.৪%", changeType: "down", unit: "কেজি", icon: "🧄", minPrice: "১২০", maxPrice: "১৩৫", avgPrice: "১২৫", diff: "১০" },
  { id: "32", slug: "shukna-morich", name: "শুকনা মরিচ", category: "moshla", price: "২৪৫", change: "-১.০%", changeType: "down", unit: "কেজি", icon: "🌶️", minPrice: "২৪০", maxPrice: "২৫০", avgPrice: "২৪৫", diff: "২" },
  { id: "33", slug: "dhonia-gura", name: "ধনিয়া গুঁড়া", category: "moshla", price: "২৬৫", change: "০.০%", changeType: "flat", unit: "কেজি", icon: "🧂", minPrice: "২৫৫", maxPrice: "২৭৫", avgPrice: "২৬৫", diff: "০" },
];

function toBangla(val) {
  if (val === undefined || val === null || val === "") return "";
  const banglaDigits = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
  };
  return String(val).replace(/\d/g, (d) => banglaDigits[d] || d);
}

function normalizeUnit(unit = "") {
  const u = String(unit).toLowerCase().trim();
  if (u === "kg" || u === "কেজি") return "কেজি";
  if (u === "litre" || u === "liter" || u === "l" || u === "লিটার") return "লিটার";
  if (u === "dozen" || u === "ডজন") return "ডজন";
  if (u === "piece" || u === "pc" || u === "টি") return "টি";
  if (u === "packet" || u === "pkt" || u === "প্যাকেট") return "প্যাকেট";
  if (u === "gram" || u === "gm" || u === "গ্রাম") return "গ্রাম";
  return unit || "কেজি";
}

function normalizeProduct(item, index) {
  const fallback =
    PRODUCTS_DATA.find((p) => String(p.id) === String(item.id || item._id)) ||
    PRODUCTS_DATA[index] ||
    {};

  // 1. Resolve Name
  let name =
    item.name_bn ||
    item.nameBn ||
    item.bangla_name ||
    item.product_name ||
    item.productName ||
    item.title_bn ||
    item.title ||
    (typeof item.name === "string" ? item.name : item.name?.bn || item.name?.bangla) ||
    fallback.name ||
    "";

  // 2. Resolve Price
  let rawPrice = item.price;
  if (typeof rawPrice === "object" && rawPrice !== null) {
    rawPrice = rawPrice.avg ?? rawPrice.current ?? rawPrice.today ?? rawPrice.value;
  }
  if (!rawPrice) {
    rawPrice =
      item.current_price ??
      item.currentPrice ??
      item.avg_price ??
      item.avgPrice ??
      item.today_price ??
      item.todayPrice ??
      item.price_bdt ??
      fallback.price ??
      "";
  }
  const price = toBangla(rawPrice);

  // 3. Resolve Change & Trend
  let numericChange = 0;
  let changeStr = "০.০%";
  let changeType = "flat";
  let diff = fallback.diff || "০";

  if (typeof item.change === "object" && item.change !== null) {
    const rawPct = item.change.percentage ?? item.change.percent ?? item.change.value ?? 0;
    const rawType = item.change.type ?? item.change.direction ?? "";
    const rawDiff = item.change.diff ?? item.change.amount ?? 0;

    const numVal = parseFloat(String(rawPct).replace(/[^\d.-]/g, "")) || 0;
    if (rawType === "down" || String(rawPct).includes("-")) {
      numericChange = -Math.abs(numVal);
      changeType = "down";
      changeStr = `-${toBangla(Math.abs(numVal))}%`;
    } else if (rawType === "up" || String(rawPct).includes("+") || numVal > 0) {
      numericChange = Math.abs(numVal);
      changeType = "up";
      changeStr = `+${toBangla(Math.abs(numVal))}%`;
    } else {
      numericChange = 0;
      changeType = "flat";
      changeStr = "০.০%";
    }
    if (rawDiff) diff = toBangla(Math.abs(parseFloat(rawDiff) || 0));
  } else if (item.change !== undefined && item.change !== null && item.change !== "") {
    const raw = String(item.change);
    const numVal = parseFloat(raw.replace(/[^\d.-]/g, "")) || 0;
    if (raw.includes("-") || item.changeType === "down") {
      numericChange = -Math.abs(numVal);
      changeType = "down";
      changeStr = `-${toBangla(Math.abs(numVal))}%`;
    } else if (raw.includes("+") || item.changeType === "up" || numVal > 0) {
      numericChange = Math.abs(numVal);
      changeType = "up";
      changeStr = `+${toBangla(Math.abs(numVal))}%`;
    } else {
      numericChange = 0;
      changeType = "flat";
      changeStr = "০.০%";
    }
  } else {
    changeStr = fallback.change || "০.০%";
    changeType = fallback.changeType || "flat";
    numericChange = changeType === "up" ? 1 : changeType === "down" ? -1 : 0;
  }

  return {
    id: String(item.id || fallback.id || index + 1),
    slug: item.slug || fallback.slug || `product-${index + 1}`,
    name,
    category: item.category || fallback.category || "chal",
    price,
    change: changeStr,
    changeType,
    numericChange,
    unit: normalizeUnit(item.unit || fallback.unit),
    icon: item.icon || fallback.icon || "🛒",
    minPrice: toBangla(item.min_price || item.minPrice || fallback.minPrice || price),
    maxPrice: toBangla(item.max_price || item.maxPrice || fallback.maxPrice || price),
    avgPrice: toBangla(item.avg_price || item.avgPrice || fallback.avgPrice || price),
    diff,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let rawItems = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const primaryRes = await fetch(`${PRIMARY_API_URL}/products`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    clearTimeout(timeout);

    const contentType = primaryRes.headers.get("content-type") || "";
    if (primaryRes.ok && contentType.includes("application/json")) {
      const data = await primaryRes.json();
      const list = Array.isArray(data) ? data : data.products;
      if (Array.isArray(list) && list.length > 0) {
        rawItems = list;
      }
    }
  } catch (err) {}

  if (!rawItems || rawItems.length === 0) {
    rawItems = PRODUCTS_DATA;
  }

  // Normalize every item so all field names and formats are guaranteed
  let normalized = rawItems.map((item, idx) => normalizeProduct(item, idx));

  if (category) {
    normalized = normalized.filter(
      (p) => String(p.category).toLowerCase() === category.toLowerCase()
    );
  }

  return NextResponse.json(normalized);
}