import ResumeClient from "@/app/components/ResumeClient";
import pageStyles from "@/app/page.module.css";
import fs from "fs/promises";
import path from "path";
import { Inter, Rubik, Dosis } from "next/font/google";
import Navbar from "@/app/components/Navbar";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume',
};
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-inter",
  display: "swap",
});
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-rubik",
  display: "swap",
});
const dosis = Dosis({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dosis",
  display: "swap",
});

export default async function Page() {
  let resume: Record<string, unknown> | null = null;
  try {
    const json = await fs.readFile(
      path.join(process.cwd(), "public", "resume.json"),
      "utf8"
    );
    resume = JSON.parse(json) as Record<string, unknown>;
  } catch {
    // If the file isn't available just render an empty state
    resume = null;
  }

  return (
    <div
      className={`${inter.variable} ${rubik.variable} ${dosis.variable} ${pageStyles.centered}`}
    >
      <Navbar />
      <div style={{ width: "100%", maxWidth: 960 }}>
        <ResumeClient resume={resume} />
      </div>
    </div>
  );
}
