import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/providers/provider";
export const metadata: Metadata = {
  title: "Equi-Share",
  description: "For ease of money management",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {children}
          <Toaster
            
          />
        </Provider>
      </body>
    </html>
  );
}
