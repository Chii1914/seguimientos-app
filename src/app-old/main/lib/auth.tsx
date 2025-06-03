"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import __url from "./const";

export function useAuth() {
  const Router = useRouter();

  async function verifyToken() {

    try {
      const response = await axios.get(`${__url}/auth/verify`, {
        headers: {
          'Authorization': `${Cookies.get("xvlf")}`
        }
      });
      if (response.status === 200) {
        console.info("continue");
        return true;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        Router.push("/");
      } else {
        console.error(error);
      }
    }
    return false;
  }


  useEffect(() => {
    async function checkToken() {
      await new Promise(resolve => setTimeout(resolve, 3000));
      let auth = await verifyToken();
      if (typeof window !== "undefined" && !Cookies.get("xvlf") && auth) {
        Router.push("/");
      }
    }
    checkToken();
  }, [Cookies.get("xvlf"), Router]);

  return Cookies.get("xvlf");
}
