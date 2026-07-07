import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { PremiumShell } from "@/components/effects/PremiumShell";
import {
  LOADER_BOOT_SCRIPT,
  LoadingScreenMarkup,
} from "@/components/effects/LoadingScreenMarkup";
import { PORTFOLIO_LOGO } from "@/lib/constants";
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
    images: [{ url: PORTFOLIO_LOGO, alt: "DErk2104 portfolio logo" }],
  },
  icons: {
    icon: [
      { url: PORTFOLIO_LOGO, type: "image/png" },
      { url: PORTFOLIO_LOGO, type: "image/png", sizes: "32x32" },
      { url: PORTFOLIO_LOGO, type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: PORTFOLIO_LOGO, type: "image/png" }],
    shortcut: PORTFOLIO_LOGO,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: LOADER_BOOT_SCRIPT,
          }}
        />
        <link rel="preload" href={PORTFOLIO_LOGO} as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src="/cursor-init.js" strategy="afterInteractive" />
        <LoadingScreenMarkup />
        <Script src="/loader-init.js" strategy="afterInteractive" />
        <PremiumShell>{children}</PremiumShell>
      </body>
    </html>
  );
}
