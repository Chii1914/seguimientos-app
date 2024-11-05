"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const Router = useRouter();
  const token = Cookies.get("xvlf");

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      Router.push("/");
    }
  }, [token, Router]);

  return token; // Optional: Return the token if needed
}
