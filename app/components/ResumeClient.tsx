"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import styles from "@/app/nogimmick/resume/resume.module.css"

import { faGithub } from "@fortawesome/free-brands-svg-icons";
type WorkEntry = {
  name?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
};

type Skill = { name?: string; keywords?: string[] };

type Education = {
  institution?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
};

type Achievement = { text?: string };

type Resume = {
  basics?: { name?: string; email?: string; url?: string; location?: { address?: string } };
  "personal-statement"?: string;
  work?: WorkEntry[];
  skills?: Skill[];
  education?: Education[];
  achievements?: Achievement[];
  "extra-links"?: { work_history?: { text?: string; link?: string }, interactive_resume?: { text?: string; link?: string } };
};

function fmtDate(v?: string) {
  if (!v) return "";
  if (v === "Present") return "Present";
  if (/^\d{4}$/.test(v)) return v;
  if (/^\d{4}-\d{2}$/.test(v)) {
    const [y, m] = v.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleString(undefined, {
      month: "short",
      year: "numeric",
    });
  }
  return v;
}

export default function ResumeClient({ resume }: { resume: Resume | null }) {
  const [pdfAvailable, setPdfAvailable] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function checkResume() {
      try {
        const resp = await fetch('https://api.github.com/repos/cmathews393/chloemathews.net/releases/latest');
        if (!resp.ok) throw new Error('no release');
        const data = await resp.json();
        const asset = (data.assets || []).find((a: { name?: string; browser_download_url?: string }) => a.name === 'resume.pdf');
        if (asset && asset.browser_download_url) {
          if (mounted) {
            setPdfAvailable(true);
            setPdfUrl(asset.browser_download_url);
          }
          return;
        }
      } catch {
        // ignore and try local fallback
      }

      // fallback to local file
      try {
        const res = await fetch('/resume.pdf', { method: 'HEAD' });
        if (mounted) {
          setPdfAvailable(res.ok);
          if (res.ok) setPdfUrl('/resume.pdf');
        }
      } catch {
        if (mounted) setPdfAvailable(false);
      }
    }

    checkResume();
    return () => {
      mounted = false;
    };
  }, []);

  const onDownload = () => {
    if (pdfAvailable && pdfUrl) {
      // open the latest release asset (or local fallback) in a new tab
      window.open(pdfUrl, '_blank', 'noopener');
    } else {
      window.print();
    }
  };

  if (!resume) {
    return (
      <div className={styles.card}>
        <h1 className={styles.name}>Resume</h1>
        <p>Resume data could not be loaded.</p>
        <p>
          You can still view the raw data at <a href="/resume.json">/resume.json</a>
        </p>
      </div>
    );
  }

  const basics = resume.basics ?? {};
  const name = basics.name ?? "Resume";
  const email = basics.email;
  const url = basics.url;
  const location = (basics.location as { address?: string } | undefined)?.address;
  const personalStatement = (resume["personal-statement"] ?? "").trim();

  const work = (resume.work ?? []) as WorkEntry[];
  const skills = (resume.skills ?? []) as Skill[];
  const education = (resume.education ?? []) as Education[];
  const achievements = (resume.achievements ?? []) as Achievement[];

  return (
    <article className={styles.container} id="resume-content">
      <header className={styles.header}>
        <div>
          <h1 className={styles.name}>{name}</h1>
          <div className={styles.meta}>
            {email && (
              <a href={`mailto:${email}`} className={styles.pill}>
                {email}
              </a>
            )}
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className={styles.pill}>
                <FontAwesomeIcon icon={faGithub} />Github
              </a>
            )}
            {
              resume?.["extra-links"]?.interactive_resume?.link && (
                <a
                  href={resume["extra-links"].interactive_resume.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pill}
                >
                  {resume["extra-links"].interactive_resume.text}
                </a>
              )
            }
            {location && <span className={styles.pill}>{location}</span>}
            {resume?.["extra-links"]?.work_history?.link && (
              <a
                href={resume["extra-links"].work_history.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pill}
              >
                {resume["extra-links"].work_history.text}
              </a>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {pdfAvailable && pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.button}
              aria-label="Download PDF"
            >
              <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
            </a>
          ) : (
            <button onClick={onDownload} className={styles.button} aria-label="Print / Save as PDF">
              <FontAwesomeIcon icon={faPrint} aria-hidden="true" />
            </button>
          )}
          <a className={styles.linkButton} href="/resume.json" target="_blank" rel="noopener noreferrer">
            Raw JSON
          </a>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <section className={`${styles.section} ${styles.compact}`}>
            <h2>About</h2>
            <p className={styles.statement}>{personalStatement}</p>
          </section>

          <section className={`${styles.section} ${styles.compact}`}>
            <h2>Skills</h2>
            <div className={styles.skillList}>
              {skills.map((s: Skill, i: number) => (
                <div key={i} className={styles.skillCompact}>
                  <div className={styles.skillName}>{s.name}</div>
                  <div className={styles.kw}>{(s.keywords ?? []).join(" • ")}</div>
                </div>
              ))}
            </div>
          </section>

          <section className={`${styles.section} ${styles.compact}`}>
            <h2>Achievements</h2>
            {achievements.length ? (
              <ul className={styles.achList}>
                {achievements.map((a: Achievement, i: number) => (
                  <li key={i}>{a.text}</li>
                ))}
              </ul>
            ) : (
              <p>—</p>
            )}
          </section>
        </aside>

        <main className={styles.main}>
          <section className={styles.section}>
            <h2 >Work experience</h2>
            <div className={styles.work}>
              {work.map((w: WorkEntry, idx: number) => (
                <div key={idx} className={styles.workItem}>
                  <div className={styles.row}>
                    <div>
                      <div className={styles.title}>{(w.position ?? "") + (w.name ? ` — ${w.name}` : "")}</div>
                      <div className={styles.subtitle}>{[fmtDate(w.startDate), fmtDate(w.endDate)].filter(Boolean).join(" — ")}</div>
                    </div>
                  </div>
                  {Array.isArray(w.highlights) && w.highlights.length ? (
                    <ul className={styles.highlights}>
                      {w.highlights.map((h: string, i: number) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Education</h2>
            <div>
              {education.map((ed: Education, i: number) => (
                <div key={i} className={styles.workItem}>
                  <div className={styles.title}>{ed.institution}{ed.area ? ` — ${ed.area}` : ""}</div>
                  <div className={styles.subtitle}>{[ed.studyType, [fmtDate(ed.startDate), fmtDate(ed.endDate)].filter(Boolean).join(" — ")].filter(Boolean).join(" • ")}{ed.score ? ` • ${ed.score}` : ""}</div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </article>
  );
}
