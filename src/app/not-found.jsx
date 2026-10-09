import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-5xl shadow-inner select-none">
        🛒
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          ৪০৪ — পৃষ্ঠাটি পাওয়া যায়নি
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          আপনি যে ঠিকানাটি খুঁজছেন তা বিদ্যমান নেই, সরানো হয়েছে অথবা লিংকটি ভুল ছিল।
        </p>
      </div>

      <div>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition shadow-sm"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}