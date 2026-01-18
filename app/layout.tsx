import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Women for Tomorrow - Voice Assistant",
  description: "Voice agent for Women for Tomorrow association",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
