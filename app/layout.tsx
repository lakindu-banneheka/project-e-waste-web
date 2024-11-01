import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import TanstackQueryProvider from "@/utils/Providers";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project E-Waste",
  description: "Project E-Waste by university of kelaniya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              // defaultTheme="light"
              // defaultTheme="system" //system, light, dark
              enableSystem
              disableTransitionOnChange
            >
              <TanstackQueryProvider >
                {children}
                <Toaster richColors />
              </TanstackQueryProvider>
            </ThemeProvider>  
        </AuthProvider>
      </body>
    </html>
  );
}
