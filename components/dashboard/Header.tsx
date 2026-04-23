"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-6">
      {/* Search */}
      <div
        className={cn(
          "flex flex-1 items-center gap-2.5 rounded-lg border bg-gray-50 px-3.5 py-2 transition-all duration-150",
          focused
            ? "border-[#1B3FA6] bg-white ring-2 ring-[#1B3FA6]/10"
            : "border-gray-200"
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher un OF, un article, un poste de travail..."
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <kbd className="hidden items-center gap-0.5 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400 sm:flex">
          Ctrl&nbsp;K
        </kbd>
      </div>

      {/* Notifications */}
      <button
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
          3
        </span>
      </button>

      {/* User avatar */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-white">
        YA
      </div>
    </header>
  );
}
