import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { createAdminClient } from "./supabase/admin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        if (!username || !password) return null;

        const supabase = createAdminClient();
        const { data: user } = await supabase
          .from("admin_users")
          .select("id, username, password_hash")
          .eq("username", username)
          .single();

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) return null;

        return { id: user.id, name: user.username };
      },
    }),
  ],
});
