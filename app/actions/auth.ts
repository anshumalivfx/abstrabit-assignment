"use server";

import { signOut as nextAuthSignOut } from "next-auth/react";

export async function signOut() {
  // NextAuth signOut is handled client-side via the button
  // This file can be removed or kept for future server actions
}
