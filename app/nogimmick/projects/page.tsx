import React from "react";
import styles from "@/app/page.module.css";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPython, faRust } from "@fortawesome/free-brands-svg-icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
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
    description: "This website!",
    url: "https://github.com/cmathews393/chloemathews.net",
    language: "NextJS (TypeScript)",
  },
  Kleya: {
    description: "A WIP Rust app for distributed metadata.",
    url: "https://github.com/cmathews393/kleya",
    language: "Rust",
  },
};

const work_project_dictionary: NestedRecord = {
  "Alert Overload": {
    description:
      "Improve alert tuning and prioritization in NOC to reduce alert fatigue. Reduced alert volume by 60% and maintained service quality/outage impact levels.",
    url: "/nogimmick/projects/alert-overload",
  },
  "User Manager": {
    description:
      "A Flask web app to manager user onboarding and offboarding. Integrates with Workday, Entra, and various internal systems to automate and streamline the onboarding process. Backed by a FastAPI app and Postgres database.",
    language: "Python",
    url: "/nogimmick/projects/user-manager",
  },
  "Proactive Work Campaigns": {
    description:
      "Integrate PSA, monitoring systems and documentation platform to automate proactive work campaigns. Merges data between monitoring system(s) and documentation platform to identify gaps and proactive work opportunities. Takes that data and creates tickets in bulk, with appropriate client etc. ",
    language: "Python",
    url: "/nogimmick/projects/proactive-work-campaigns",
  },
  "Implement Observability": {
    description:
      "Integrate OTEL (via honeycomb) into internal services. Add and tune OTEL tracing to Flask, Streamlit (custom implementation), and FastAPI apps to improve observability and tune performance.",
    language: "Python",
    url: "/nogimmick/projects/observability",
  },
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
    return <FontAwesomeIcon icon={faRust} className={styles.projectTechIcon} />;
  }
  return null;
}

export default function Page() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Personal Projects</h2>

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
        <h2 className={styles.title}>Work Projects</h2>
        <div className={styles.projectList}>
          {Object.entries(work_project_dictionary).map(([name, meta]) => (
            <article key={name} className={styles.card}>
              <h3 className={styles.projectTitle}>{name}</h3>

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
