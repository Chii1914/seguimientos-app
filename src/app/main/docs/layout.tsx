import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TokenProvider } from '../../context/TokenContext';
import { auth0 } from "../../../lib/auth0";
import Login from "../../components/login";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Documentos y concentimiento estudiante",
  description: "Documentos y concentimiento para el estudiante",
  keywords: "estudiante, documentos, concentimiento, fotos, carnet",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth0.getSession()
  if (session) {
    // If the session exists, redirect to the main page
    return (
      <TokenProvider>
        {children}
      </TokenProvider>
    );
  }
  if (!session) {
    <>
      <h1>Accesso denegado</h1>
      <Login />
    </>
  }

}



