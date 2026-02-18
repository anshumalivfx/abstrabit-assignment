"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="relative group px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
    >
      <span className="flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign Out
      </span>
    </button>
  );
}
