import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    accessToken?: string;
    error?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string | null;
      image?: string | null;
    };
  }
}
