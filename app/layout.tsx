import "./globals.css";
import type { ReactNode } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { Metadata } from 'next';
import { Rubik, Inter, Dosis } from "next/font/google";
import styles from "@/app/page.module.css";
import { BrowserTelemetry } from "./components/BrowserTelemetry";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-rubik",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-inter",
  display: "swap",
});

const dosis = Dosis({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dosis",
  display: "swap",
});

export const metadata: Metadata = {
  title:
  {
    template: '%s | Chloe Mathews',
    default: 'Chloe Mathews | DevOps Engineer',
  },
  description: 'Homepage for Chloe Mathews, DevOps Engineer.',

};
config.autoAddCss = false;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <BrowserTelemetry />
      <body className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]no-scrollbar">
        <div
          className={`${rubik.variable} ${inter.variable} ${dosis.variable} ${styles.nogimmickRoot}`}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
