"use client";

import { useEffect, useState } from "react";
import { deleteBookmark } from "@/app/actions/bookmarks";
import type { Bookmark } from "@/types";

interface BookmarkListProps {
  initialBookmarks: Bookmark[];
}

export default function BookmarkList({ initialBookmarks }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  useEffect(() => {
    // Poll for updates every 2 seconds to simulate real-time
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/bookmarks");
        if (response.ok) {
          const data = await response.json();
          setBookmarks(data.bookmarks);
        }
      } catch (error) {
        console.error("Error polling bookmarks:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (bookmarkId: string) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) {
      return;
    }

    setDeletingId(bookmarkId);
    try {
      await deleteBookmark(bookmarkId);
      // Optimistically update UI
      setBookmarks((current) =>
        current.filter((bookmark) => bookmark.id !== bookmarkId),
      );
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      alert("Failed to delete bookmark");
    } finally {
      setDeletingId(null);
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="relative group animate-fade-in">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-white/80 backdrop-blur-xl p-12 rounded-2xl shadow-xl text-center border border-white/20">
          <div className="text-gray-300 mb-4 animate-float">
            <svg
              className="w-20 h-20 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <p className="text-gray-700 text-xl font-semibold mb-2">
            No bookmarks yet
          </p>
          <p className="text-gray-500 text-sm">
            ✨ Add your first bookmark using the form above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          Your Bookmarks ({bookmarks.length})
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
      </div>
      {bookmarks.map((bookmark, index) => (
        <div
          key={bookmark.id}
          className="relative group transform transition-all duration-300 hover:scale-[1.02] animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-xl p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {bookmark.title}
                  </h3>
                </div>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-purple-600 text-sm break-all font-medium flex items-center gap-2 group/link transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0 opacity-70 group-hover/link:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span className="group-hover/link:underline">
                    {bookmark.url}
                  </span>
                </a>
                <div className="flex items-center gap-2 mt-3">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-gray-500 font-medium">
                    {new Date(bookmark.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    •{" "}
                    {new Date(bookmark.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(bookmark.id)}
                disabled={deletingId === bookmark.id}
                className="relative group/delete flex-shrink-0 p-2.5 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
                title="Delete bookmark"
              >
                {deletingId === bookmark.id ? (
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
