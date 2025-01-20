import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { StyledRoot } from './StyledRoot';
import theme from './theme'
import { ThemeProvider } from "@mui/material/styles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de seguimientos académicos uv",
  description: "Página de inicio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <StyledRoot>{children}</StyledRoot>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
