"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { CATEGORIES, getBanglaTodayDate } from "@/lib/utils";

const NAV_CATEGORIES = CATEGORIES || [
  { id: "chal", slug: "chal", name: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", name: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", name: "তেল", icon: "🫙" },
  { id: "sobji", slug: "sobji", name: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", name: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", name: "মাংস", icon: "🍗" },
  { id: "dim-dudh", slug: "dim-dudh", name: "ডিম-দুধ", icon: "🥛" },
  { id: "moshla", slug: "moshla", name: "মসলা", icon: "🌶️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const banglaDate = getBanglaTodayDate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  };

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Bar: Brand, Date & User Session */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center p-2 shadow-sm group-hover:bg-emerald-800 transition-colors">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর লোগো"
                width={26}
                height={26}
                priority
                className="object-contain brightness-0 invert"
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors block">
                বাজার দর
              </span>
              <span className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 block">
                {banglaDate}
              </span>
            </div>
          </Link>

          {/* Right Side: Authentication Controls */}
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="w-24 h-9 bg-gray-100 rounded-xl animate-pulse" />
            ) : session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl hover:bg-gray-50 border border-gray-200 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {userInitial}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate hidden sm:inline">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-gray-400">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400">লগইন করা হয়েছে</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {session.user.name}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      লগআউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar select-none border-t border-gray-50 text-sm">
          {NAV_CATEGORIES.map((cat) => {
            const isActive =
              pathname === `/category/${cat.slug}` ||
              pathname === `/category/${cat.id}`;

            return (
              <Link
                key={cat.id || cat.slug}
                href={`/category/${cat.slug || cat.id}`}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all text-xs sm:text-sm ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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