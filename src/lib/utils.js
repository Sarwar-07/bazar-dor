export const BANGLA_DIGITS = {
  "০": 0, "১": 1, "২": 2, "৩": 3, "৪": 4,
  "৫": 5, "৬": 6, "৭": 7, "৮": 8, "৯": 9
};

export const parseBanglaNumber = (str) => {
  if (!str) return 0;
  const cleaned = String(str).replace(/[^\d০-৯.]/g, "");
  const english = cleaned.replace(/[০-৯]/g, (d) => BANGLA_DIGITS[d]);
  return parseFloat(english) || 0;
};

export const toBanglaNumber = (num) => {
  if (num === null || num === undefined) return "";
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => banglaDigits[d]);
};

export const getBanglaTodayDate = () => {
  const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  const now = new Date();
  const dayName = days[now.getDay()];
  const date = toBanglaNumber(now.getDate());
  const monthName = months[now.getMonth()];
  const year = toBanglaNumber(now.getFullYear());
  return `${dayName}, ${date} ${monthName}, ${year}`;
};

export const CATEGORIES = [
  { id: "chal", name: "চাল", icon: "🍚" },
  { id: "dal", name: "ডাল", icon: "🫘" },
  { id: "tel", name: "তেল", icon: "🫙" },
  { id: "sobji", name: "সবজি", icon: "🥬" },
  { id: "mach", name: "মাছ", icon: "🐟" },
  { id: "mangsho", name: "মাংস", icon: "🍗" },
  { id: "dim-dudh", name: "ডিম-দুধ", icon: "🥛" },
  { id: "moshla", name: "মসলা", icon: "🌶️" },
];