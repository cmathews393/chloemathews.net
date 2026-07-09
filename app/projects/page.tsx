import React from "react";
import styles from "@/app/shared.module.css";
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
      "Syncs Spotify playlists to Plex — deprecated now, but the first real thing I wrote in Python 😊",
    url: "https://github.com/cmathews393/spotify-to-plex",
    language: "Python",
  },
  "chloemathews.net": {
    description: "This website!",
    url: "https://github.com/cmathews393/chloemathews.net",
    language: "NextJS (TypeScript)",
  },
};

const work_project_dictionary: NestedRecord = {
  "Alert Overload": {
    description:
      "Tuned and prioritized NOC alerts to reduce alert fatigue. Cut alert volume by 60% while maintaining service quality and outage-impact levels.",
  },
  "User Manager": {
    description:
      "A Flask web app to manage user onboarding and offboarding. Integrates with Workday, Entra, and various internal systems to automate and streamline the onboarding process. Backed by a FastAPI service and Postgres database.",
    language: "Python",
  },
  "Proactive Work Campaigns": {
    description:
      "Integrates the PSA, monitoring systems, and documentation platform to automate proactive work campaigns. Merges data across systems to identify gaps and proactive work opportunities, then creates tickets in bulk with the correct client, priority, and assignment.",
    language: "Python",
  },
  Observability: {
    description:
      "Integrated OTEL (via Honeycomb) into internal services. Added and tuned tracing across Flask, Streamlit (custom implementation), and FastAPI apps to improve observability and tune performance.",
    language: "Python",
  },
  "Azure Migration": {
    description:
      "Migrated internal services from on-premises Docker + Ansible deployments to Azure Container Apps. Rewrote build and deployment pipelines for staging and production, and defined Azure networking, Container Apps, and Postgres infrastructure in Bicep.",
    language: "Azure, Docker",
  },
  "Backend Consolidation": {
    description:
      "Consolidated 2 Flask apps and 1 FastAPI app into a single internal FastAPI service, updating models, schemas, and third-party API clients. Refactored and improved logic where possible, and optimized the codebase for maintainability — adding agent guardrails and strengthening tests and linting requirements.",
    language: "Python",
  },
  "Frontend Consolidation": {
    description:
      "Migrated frontend features and logic from Flask/Jinja templates and Streamlit to a React + Vite SPA, setting up msal-react for authentication and moving all business logic to the backend API. Built responsive UI elements with TanStack components and Tailwind, tightly integrated with the backend.",
    language: "React (TypeScript)",
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
