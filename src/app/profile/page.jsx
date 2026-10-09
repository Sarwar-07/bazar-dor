"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("প্রোফাইল দেখতে অনুগ্রহ করে আগে লগইন করুন");
      router.push("/signin");
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("সাইন আউট সফল হয়েছে");
    router.push("/");
    router.refresh();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("অনুগ্রহ করে একটি নাম লিখুন");
      return;
    }

    setUpdating(true);
    try {
      const res = await authClient.updateUser({
        name: name.trim(),
      });

      if (res?.error) {
        toast.error(res.error.message || "নাম আপডেট করা যায়নি");
      } else {
        toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
        if (refetch) await refetch();
        router.refresh();
      }
    } catch (err) {
      toast.error("আপডেট করার সময় ত্রুটি দেখা দিয়েছে");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-32 bg-white rounded-3xl border border-gray-100 animate-pulse" />
        <div className="h-44 bg-white rounded-3xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          আমার প্রোফাইল
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center shadow-sm shrink-0">
            {session.user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {session.user.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-xs">
              {session.user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shrink-0"
        >
          <span>↩</span> সাইন আউট
        </button>
      </div>

      {/* Information Update Form Card (Challenge C3) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">তথ্য</h3>
          <Link
            href="/profile/update"
            className="text-xs text-emerald-700 font-semibold hover:underline"
          >
            আলাদা পেজে আপডেট করুন →
          </Link>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পুরো নাম"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition shadow-sm disabled:opacity-60"
          >
            {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
          </button>
        </form>
      </div>
    </div>
  );
}