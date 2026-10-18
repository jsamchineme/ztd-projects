"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export interface LoginState {
  error: string | null;
  email: string; // kept so a failed attempt doesn't clear the field
}

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const callbackUrl = String(fd.get("callbackUrl") ?? "/admin");
  const email = String(fd.get("email") ?? "").trim();
  try {
    await signIn("credentials", {
      email,
      password: String(fd.get("password") ?? ""),
      redirectTo: callbackUrl.startsWith("/admin") ? callbackUrl : "/admin",
    });
    return { error: null, email };
  } catch (e) {
    if (e instanceof AuthError) {
      const error = e.type === "CredentialsSignin" ? "Wrong email or password." : "Sign-in failed. Please try again.";
      return { error, email };
    }
    throw e; // the success redirect
  }
}
