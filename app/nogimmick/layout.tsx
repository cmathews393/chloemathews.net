import type { ReactNode } from "react";
import styles from "@/app/page.module.css";
import { Rubik, Inter, Dosis } from "next/font/google";

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
  weight: [ "700"],
  variable: "--font-dosis",
  display: "swap",
});

export default function NogimmickLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${rubik.variable} ${dosis.variable} ${styles.nogimmickRoot}`}
    >
      {children}
    </div>
  );
}
