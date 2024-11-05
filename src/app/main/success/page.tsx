"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use this instead of "next/router"
import Cookies from "js-cookie";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // Access the URL search params to get `xvlf` from the query
    const params = new URLSearchParams(window.location.search);
    const xvlf = params.get("xvlf");

    if (xvlf) {
      // Save the session token in a cookie
      Cookies.set("xvlf", xvlf, { expires: 7, path: "/" });
      // Redirect to the main page or a protected page after login
      router.push("/main");
    }
  }, [router]);

  return <p>Logging you in...</p>;
}
