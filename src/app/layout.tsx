import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DErk2104 | Roblox Developer Portfolio",
  description:
    "Roblox scripter, animator, VFX artist, builder, and 3D modeler. UI, emotes, movement, and Blender assets.",
  keywords: [
    "Roblox",
    "developer",
    "scripter",
    "animator",
    "VFX",
    "builder",
    "3D modeler",
    "portfolio",
  ],
  openGraph: {
    title: "DErk2104 | Roblox Developer Portfolio",
    description:
      "Roblox development portfolio featuring scripting, animation, VFX, building, and 3D modeling work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
