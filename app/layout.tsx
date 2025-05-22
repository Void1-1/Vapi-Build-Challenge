import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "F.R.I.D.A.Y. AI",
  description:
    "An ai communication platform based on the iconic F.R.I.D.A.Y ai from the MCU.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}

        <CustomCursor />
      </body>
    </html>
  );
}
