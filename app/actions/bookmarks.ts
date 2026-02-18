"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function addBookmark(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;

  if (!title || !url) {
    throw new Error("Title and URL are required");
  }

  try {
    await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        title,
        url,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw new Error("Failed to add bookmark");
  }
}

export async function deleteBookmark(bookmarkId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Verify ownership before deleting
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
      select: { userId: true },
    });

    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    if (bookmark.userId !== session.user.id) {
      throw new Error("Unauthorized");
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    throw new Error("Failed to delete bookmark");
  }
}
