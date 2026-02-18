import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export interface Bookmark {
  id: string;
  userId: string;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
