"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const xvlf = params.get("xvlf");

    // Remove the old cookie
    Cookies.remove("xvlf");

    if (xvlf) {
      // Set the new cookie
      Cookies.set("xvlf", xvlf, { expires: 7, path: "/" });

      const newToken = Cookies.get("xvlf");

      if (newToken === xvlf) {
        router.push("/main");
      } else {
        console.error("Failed to set the new token correctly.");
      }
    }
  }, [router]);

  return <p>Logging you in...</p>;
}
