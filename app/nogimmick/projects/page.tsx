
import React from "react";
import styles from "@/app/page.module.css";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPython, faRust } from "@fortawesome/free-brands-svg-icons";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
};
type NestedRecord = Record<string, Record<string, string>>;
const project_dictionary: NestedRecord = {
  Spotiplex: {
    description:
      "Spotiplex is deprecated but it was the first real thing I wrote in Python 😊",
    url: "https://github.com/cmathews393/spotify-to-plex",
    language: "Python",
  },
  Storygrabber: {
    description:
      "An app to synchronize StoryGraph 'want to read' lists with LazyLibrarian/Audiobookshelf.",
    url: "https://github.com/cmathews393/storygrabber",
    language: "Python",
  },
  "chloemathews.net": {
    description: "This website! Why did I use Next for a portfolio site? Who knows.",
    url: "https://github.com/cmathews393/chloemathews.net",
    language: "NextJS (TypeScript)",
  },
  Kleya : {
    description: "A WIP Rust app for distributed metadata.",
    url: "https://github.com/cmathews393/kleya",
    language: "Rust",
  }
};

function getTechIcon(name: string, meta: Record<string, string>) {
  if (name === "chloemathews.net") {
    return (
      <Image
        src="https://img.icons8.com/fluency-systems-filled/48/nextjs.png"
        alt="Next.js"
        className={styles.projectTechIcon}
        width={20}
        height={20}
      />
    );
  }
  if ((meta.language || "").toLowerCase().includes("python")) {
    return (
      <FontAwesomeIcon icon={faPython} className={styles.projectTechIcon} />
    );
  }
  if ((meta.language || "").toLowerCase().includes("rust")) {
    return (
      <FontAwesomeIcon icon={faRust} className={styles.projectTechIcon}/>
    );
  }
  return null;
}

export default function Page() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Projects</h2>

        <div className={styles.projectList}>
          {Object.entries(project_dictionary).map(([name, meta]) => (
            <article key={name} className={styles.card}>
              <h3 className={styles.projectTitle}>
                <a
                  href={meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectLink}
                >
                  {name}
                </a>
              </h3>

              <span className={styles.projectLanguage}>
                {getTechIcon(name, meta)}
                {meta.language}
              </span>

              <p className={styles.projectDescription}>{meta.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
