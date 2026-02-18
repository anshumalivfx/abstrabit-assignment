import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import SignOutButton from "@/components/SignOutButton";
import type { Bookmark } from "@/types";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <header className="relative bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 animate-slide-in">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Smart Bookmark Manager
              </h1>
              <p className="text-xs text-purple-300 font-medium">
                Organize your digital world ✨
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-4 animate-slide-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent"
                />
              )}
              <span className="text-sm text-white font-semibold hidden sm:block">
                {session.user.name || session.user.email}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 py-10">
        <AddBookmarkForm />
        <BookmarkList initialBookmarks={bookmarks as Bookmark[]} />
      </main>

      {/* Footer decoration */}
      <div className="relative mt-20 pb-8 text-center">
        <p className="text-purple-300/50 text-sm font-medium">
          Made by Anshumali Karna 
        </p>
      </div>
    </div>
  );
}
