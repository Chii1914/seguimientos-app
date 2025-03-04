"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Success() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); 

  // ESTUDIANTE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const xvlf = params.get("xvlf");

    Cookies.remove("xvlf");

    if (xvlf) {
      Cookies.set("xvlf", xvlf, { expires: 7, path: "/" });
      const newToken = Cookies.get("xvlf");

      if (newToken === xvlf) {
        setTimeout(() => {
          router.push("/student/documents");
        }, 2000); // Optional: delay for spinner visibility
      } else {
        console.error("Failed to set the new token correctly.");
        setLoading(false); // Stop loading if token fails
      }
    } else {
      console.error("No token found in URL parameters.");
      setLoading(false); // Stop loading if no token
    }
  }, [router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <p>Something went wrong. Please try again.</p>
      )}
      <style jsx>{`
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
