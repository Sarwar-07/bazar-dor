"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("অনুমতি নেই, অনুগ্রহ করে সাইন ইন করুন");
      router.push("/signin");
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নামের ঘরটি পূরণ করুন");
      return;
    }

    setUpdating(true);
    try {
      const res = await authClient.updateUser({
        name: name.trim(),
      });

      if (res?.error) {
        toast.error(res.error.message || "আপডেট করা সম্ভব হয়নি");
      } else {
        toast.success("তথ্য সফলভাবে আপডেট হয়েছে!");
        if (refetch) await refetch();
        router.push("/profile");
      }
    } catch (err) {
      toast.error("ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending || !session?.user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div>
        <Link
          href="/profile"
          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-3"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">তথ্য পরিবর্তন করুন</h1>
        <p className="text-xs text-gray-500 mt-1">
          আপনার অ্যাকাউন্টের নাম পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন।
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="নতুন নাম লিখুন"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition shadow-sm disabled:opacity-60"
          >
            {updating ? "আপডেট করা হচ্ছে..." : "তথ্য আপডেট করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}