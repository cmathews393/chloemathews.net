"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/shared.module.css";
import React, { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname() ?? "/";

    const handleClick = () => {
        setIsOpen((prevState) => !prevState);
    };

    const closeMenu = () => setIsOpen(false);

    const navLink = (href: string, label: string) => {
        const active =
            pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
            <Link
                href={href}
                className={`${styles.navitem} ${active ? styles.navitemActive : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={closeMenu}
            >
                {label}
            </Link>
        );
    };

    return (
        <header className={styles.navbar} role="banner">
            <Link
                href="/"
                className={`${styles.brand} ${pathname === "/" ? styles.navitemActive : ""}`}
                onClick={closeMenu}
            >
                Home
            </Link>
            <button
                type="button"
                onClick={handleClick}
                className={styles.menuButton}
                aria-label="Toggle navigation"
                aria-expanded={isOpen}
                aria-controls="main-navigation"
            >
                <span
                    className={`${styles.menuLine} ${isOpen ? styles.menuLineTopOpen : ""}`}
                ></span>
                <span
                    className={`${styles.menuLine} ${isOpen ? styles.menuLineMiddleOpen : ""}`}
                ></span>
                <span
                    className={`${styles.menuLine} ${isOpen ? styles.menuLineBottomOpen : ""}`}
                ></span>
            </button>

            <nav
                id="main-navigation"
                className={`${styles.navlinks} ${isOpen ? styles.navlinksOpen : ""}`}
                aria-label="Main navigation"
            >
                {navLink("/projects", "Projects")}
                {navLink("/links", "Links")}
                {/*{navLink("/chat", "Chat")}*/}

                {navLink("/resume", "Résumé")}
            </nav>
        </header>
    );
}
