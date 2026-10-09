"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { CATEGORIES, getBanglaTodayDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    setTodayDate(getBanglaTodayDate());
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("সাইন আউট সফল হয়েছে");
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg shadow-sm">
            🛒
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight">
              বাজার দর
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {todayDate || "আজকের বাজার দর"}
            </p>
          </div>
        </Link>

        {/* User Auth Controls */}
        <div className="relative">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition border border-gray-200"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-800 hidden sm:inline">
                  {session.user.name}
                </span>
                <span className="text-xs text-gray-500">▼</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                    >
                      👤 আমার প্রোফাইল
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl text-left"
                    >
                      ↩ সাইন আউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-emerald-700 transition"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Category Navigation Strip */}
      <div className="border-t border-gray-100 bg-white overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = pathname === `/category/${cat.id}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}