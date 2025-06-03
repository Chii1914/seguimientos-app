import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { StyledRoot } from './StyledRoot';
import theme from './theme'
import { ThemeProvider } from "@mui/material/styles";
import { auth0 } from "../lib/auth0"
import { TokenProvider } from './context/TokenContext';
import Login from "./components/login";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de seguimientos académicos uv",
  description: "Página de inicio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth0.getSession()


  if (!session) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <Login />
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    )
  }

  if (session) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <StyledRoot>
                <TokenProvider>
                  {children}
                </TokenProvider>
              </StyledRoot>
            </ThemeProvider>
          </AppRouterCacheProvider>

        </body>
      </html>

    )
  }
}

