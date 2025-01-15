import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/providers/provider";

export const metadata: Metadata = {
  title: "Equi-Share",
  description: "Equi-Share is a web application that allows users to split bills and manage their expenses. It provides a simple and intuitive interface for users to easily track their expenses and split them among friends.",
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
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
