"use client";
import React from "react";
import styles from "@/app/page.module.css";
import Navbar from "@/components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faArrowUpRightFromSquare,
  faKey,
  faFile,
  faComment,
  faBookOpen,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faLastfm,
} from "@fortawesome/free-brands-svg-icons";

const PROFESSIONAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/cmathews393/" },
  { label: "Email (Proton)", href: "mailto:chloe@chloemathews.net" },
  { label: "Email (Gmail)", href: "mailto:chloemathews393@gmail.com" },
  { label: "GitHub", href: "https://github.com/cmathews393" },

];

const PERSONAL_LINKS = [
  {
    label: "StoryGraph",
    href: "https://app.thestorygraph.com/profile/0xchloe",
  },
  {
    label: "Last.fm",
    href: "https://www.last.fm/user/chloemathews/listening-report/week",
  },
  { label: "Letterboxd", href: "https://letterboxd.com/0xChloe/" },
];

function getIconForHref(href: string) {
  if (href.startsWith("mailto:")) return faEnvelope;
  if (href.includes("github.com")) return faGithub;
  if (href.includes("linkedin.com")) return faLinkedin;
  if (href.includes("last.fm")) return faLastfm;
  if (href.includes("letterboxd")) return faFilm;
  if (href.includes("storygraph")) return faBookOpen;
  if (href.includes("pgp")) return faKey;
  if (href.includes("cv")) return faFile;
  return faArrowUpRightFromSquare;
}

export default function Page() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Follow any of the links below to reach out or view my work.</p>

          <h4 className={styles.linkGroupTitle}>Professional Links</h4>
          <ul className={styles.linkList}>
            {PROFESSIONAL_LINKS.map((l) => (
              <li key={l.href} className={styles.linkItem}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkAnchor}
                >
                  <FontAwesomeIcon
                    icon={getIconForHref(l.href)}
                    className={styles.linkIcon}
                    aria-hidden
                  />
                  <span className={styles.linkLabel}>{l.label}</span>
                </a>
              </li>
            ))}
            <li className={styles.linkItem}>
              <span className={styles.linkAnchor}>
                <FontAwesomeIcon
                  icon={faComment}
                  className={styles.linkIcon}
                  aria-hidden
                />
                Signal: email me to ask for my Signal username if you need it.
              </span>
            </li>
          </ul>

          <h4 className={styles.linkGroupTitle}>Personal Links</h4>
          <ul className={styles.linkList}>
            {PERSONAL_LINKS.map((l) => (
              <li key={l.href} className={styles.linkItem}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkAnchor}
                >
                  <FontAwesomeIcon
                    icon={getIconForHref(l.href)}
                    className={styles.linkIcon}
                    aria-hidden
                  />
                  <span className={styles.linkLabel}>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
