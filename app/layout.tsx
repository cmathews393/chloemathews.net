import type { Metadata } from "next";
import { Inria_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
const inriaSerif = Inria_Serif({
    variable: "--font-inria-serif",
    weight: ["300", "400", "700"],
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",

    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Chloe Mathews",

    description: "Portfolio and resume app written in TypeScript with Next.js",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`${inriaSerif.variable} ${geistMono.variable} h-full`}
        >
            <body className="min-h-full flex flex-col font-sans bg-linear-to-r from-primary-900 to-primary-600 ">
                <nav className="w-full px-2 pt-2 bg-linear-to-r from-primary-900 to-primary-600 ">
                    <div className="mx-auto flex max-w-3xl items-center justify-between rounded-xl border border-primary-700 bg-primary-800 px-6 py-4">
                        <Link
                            href="/"
                            className="font-semibold tracking-tight text-foreground "
                        >
                            Chloe Mathews
                        </Link>
                        <div className="flex gap-6 text-sm text-foreground">
                            <Link
                                href="/resume"
                                className="transition-colors hover:text-primary-50"
                            >
                                Resume
                            </Link>
                            <Link
                                href="/projects"
                                className="transition-colors hover:text-primary-50"
                            >
                                Projects
                            </Link>
                            {/*<Link
                                href="/blog"
                                className="transition-colors hover:text-primary-50"
                            >
                                Blog
                            </Link>*/}
                        </div>
                    </div>
                </nav>
                {children}
                <footer className="bg-linear-to-r from-primary-900 to-primary-600 font-semibold  tracking-tight text-foreground *:text-center flex items-center justify-center *:p-1 *:m-1">
                    ©2026 Chloe Mathews. Licensed under the MIT License.
                    <a href="https://github.com/cmathews393">
                        <Image
                            alt="Github Logo"
                            width="30"
                            height="30"
                            src="/githubwhite.svg"
                        />
                    </a>
                    <a href="https://linkedin.com/in/cmathews393">
                        <Image
                            alt="LinkedIn Logo"
                            width="20"
                            height="20"
                            src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg"
                        />
                    </a>
                </footer>
            </body>
        </html>
    );
}
