import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Todo App - Manage Your Tasks Efficiently",
  description: "A powerful todo application to help you manage your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
