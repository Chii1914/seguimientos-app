import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { StyledRoot } from '../StyledRoot';
import theme from '../theme'
import { ThemeProvider } from "@mui/material/styles";
import { auth0 } from "../../lib/auth0"
import { TokenProvider } from '../context/TokenContext';
import Login from "../components/login";
import Layout from "./components/drawer";

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

  if (!session) {
    return (
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <Login />
            </ThemeProvider>
          </AppRouterCacheProvider>
    )
  }
  if (session) {
    return (
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <StyledRoot>
              <TokenProvider>
                <Layout>
                  {children}
                </Layout>
              </TokenProvider>
            </StyledRoot>
          </ThemeProvider>
        </AppRouterCacheProvider>
    )

  }
}

