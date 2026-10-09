"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("দুই পাসওয়ার্ডের মিল পাওয়া যায়নি");
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email({
        name,
        email,
        password,
      });

      if (res?.error) {
        toast.error(res.error.message || "রেজিস্ট্রেশন সফল হয়নি");
      } else {
        toast.success("অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে! অনুগ্রহ করে সাইন ইন করুন।");
        router.push("/signin");
      }
    } catch (err) {
      toast.error("অ্যাকাউন্ট তৈরিতে ত্রুটি দেখা দিয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err) {
      toast.error(`${provider} দিয়ে যুক্ত হতে সমস্যা হয়েছে`);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="text-sm text-gray-500">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="আবার লিখুন"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition shadow-sm disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-xs text-gray-400 absolute">অথবা</span>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-gray-700 transition"
          >
            <span>🌐</span> Google দিয়ে চালিয়ে যান
          </button>
          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-gray-700 transition"
          >
            <span>🐙</span> GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 pt-2">
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="text-emerald-700 font-semibold hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-800 transition">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}