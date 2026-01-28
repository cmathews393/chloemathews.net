"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/page.module.css";

export default function Navbar() {
  const pathname = usePathname() ?? "/";

  const navLink = (href: string, label: string) => {
    const active =
      pathname === href || (href !== "/" && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={`${styles.navitem} ${active ? styles.navitemActive : ""}`}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className={styles.navbar} role="banner">
      <Link
        href="/nogimmick"
        className={`${styles.brand} ${pathname === "/nogimmick" ? styles.navitemActive : ""}`}
      >
        Home
      </Link>

      <nav className={styles.navlinks} aria-label="Main navigation">
        {navLink("/nogimmick/projects", "Projects")}
        {navLink("/nogimmick/links", "Links")}
        {navLink("/nogimmick/blog", "Blog")}
        {navLink("/nogimmick/resume", "Résumé")}
      </nav>
    </header>
  );
}
