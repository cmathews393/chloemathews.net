"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import {
  AFTER_LOGIN_LINES,
  INITIAL_INTRO_LINES,
  ABOUT_LINES,
  LINKS_LINES,
  PROJECT_LINES,
} from "../data/site";

const username = "chloe";
const password = "********";
const initialDirectory = "~";

export default function Home() {
  const router = useRouter();
  const [introLines, setIntroLines] = useState<string[]>(INITIAL_INTRO_LINES);
  const [clicked, setClicked] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [revealedIntroLines, setRevealedIntroLines] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [step, setStep] = useState(0);
  const [typedUsername, setTypedUsername] = useState("");
  const [usernameIndex, setUsernameIndex] = useState(0);
  const [typedPassword, setTypedPassword] = useState("");
  const [passwordIndex, setPasswordIndex] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState(initialDirectory);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [loginLines, setLoginLines] = useState<string[]>([]);

  useEffect(() => {
    if (!showIntro) return;
    let didAppend = false;

    Promise.all([
      fetch("/ascii/kernel.txt").then((res) => (res.ok ? res.text() : "")),
      fetch("/ascii/intro.txt").then((res) => (res.ok ? res.text() : "")),
    ]).then(([kernelText, introText]) => {
      if (!didAppend) {
        const kernelLines = kernelText
          ? kernelText.split(/\r?\n/).filter(Boolean)
          : [];
        const introLines = introText
          ? introText.split(/\r?\n/).filter(Boolean)
          : [];
        const allIntroLines = [
          ...kernelLines,
          ...INITIAL_INTRO_LINES,
          ...introLines,
        ].map(toTerminalLower);

        setIntroLines(allIntroLines);
        didAppend = true;
      }
    });
  }, [showIntro]);

  useEffect(() => {
    if (!showIntro) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    if (revealedIntroLines < introLines.length) {
      t = setTimeout(() => setRevealedIntroLines((n) => n + 1), 100);
    } else if (!introDone) {
      t = setTimeout(() => setIntroDone(true), 600);
    }
    return () => t && clearTimeout(t);
  }, [showIntro, revealedIntroLines, introDone, introLines]);

  useEffect(() => {
    if (!introDone) return;
    function onDismiss() {
      setShowIntro(false);
      setClicked(true);
    }
    window.addEventListener("keydown", onDismiss);
    window.addEventListener("pointerdown", onDismiss);
    return () => {
      window.removeEventListener("keydown", onDismiss);
      window.removeEventListener("pointerdown", onDismiss);
    };
  }, [introDone]);

  useEffect(() => {
    if (!clicked) return;
    if (!showIntro && step === 0) {
      setStep(1);
      setTypedUsername("");
      setUsernameIndex(0);
      setTypedPassword("");
      setPasswordIndex(0);
    }
  }, [clicked, showIntro, step]);

  useEffect(() => {
    if (step !== 1) return;
    if (usernameIndex < username.length) {
      const t = setTimeout(() => {
        setTypedUsername(username.slice(0, usernameIndex + 1));
        setUsernameIndex((i) => i + 1);
      }, 120);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(2), 200);
    return () => clearTimeout(t);
  }, [step, usernameIndex]);

  useEffect(() => {
    if (step !== 3) return;
    if (passwordIndex < password.length) {
      const t = setTimeout(() => {
        setTypedPassword(password.slice(0, passwordIndex + 1));
        setPasswordIndex((i) => i + 1);
      }, 70);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(4), 200);
    return () => clearTimeout(t);
  }, [step, passwordIndex]);

  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => setStep(3), 200);
      return () => clearTimeout(t);
    }
    if (step === 4) {
      const t = setTimeout(() => setStep(5), 200);
      return () => clearTimeout(t);
    }
    if (step >= 5 && step < 5 + AFTER_LOGIN_LINES.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 700);
      return () => clearTimeout(t);
    }
  }, [step]);

  const animationDone = step >= 5 + AFTER_LOGIN_LINES.length;

  useEffect(() => {
    if (animationDone) {
      setShowPrompt(true);
      inputRef.current?.focus();
    }
  }, [animationDone]);

  function promptString(dir: string) {
    return `chloe@chloemathews.net:${dir}$`;
  }

  const MAX_TERMINAL_LINES = 30;

  function trimLines(lines: string[]): string[] {
    if (lines.length > MAX_TERMINAL_LINES) {
      const start = lines.length - MAX_TERMINAL_LINES;
      return lines.slice(start);
    }
    return lines;
  }

  const NEXT_VERSION = "15.5.3";

  function getHeapUsedMB() {
    if (typeof process !== "undefined" && process.memoryUsage) {
      return `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`;
    }
    const used = (performance as any)?.memory?.usedJSHeapSize;
    return used ? `${Math.round(used / 1024 / 1024)}MB` : "unknown";
  }

  function handleCommand(cmd: string) {
    const trimmed = cmd.trim();
    const lower = trimmed.toLowerCase();
    if (lower === "help") {
      setTerminalLines((lines) =>
        trimLines([
          ...lines,
          `${promptString(currentDirectory)} help`,
          "Available commands: help, about, links, projects, exit (redirects to /nogimmick)",
        ]),
      );
    } else if (lower === "home") {
      setTerminalLines((lines) =>
        trimLines([
          ...lines,
          `${promptString(currentDirectory)} home`,
          "Welcome to chloemathews.net!",
        ]),
      );
    } else if (lower === "about") {
      setTerminalLines((lines) =>
        trimLines([
          ...lines,
          `${promptString(currentDirectory)} about`,
          ...ABOUT_LINES.map(toTerminalLower),
        ]),
      );
    } else if (lower === "links") {
      setTerminalLines((lines) =>
        trimLines([
          ...lines,
          `${promptString(currentDirectory)} links`,
          ...LINKS_LINES.map(toTerminalLower),
        ]),
      );
    } else if (lower === "projects") {
      setTerminalLines((lines) =>
        trimLines([
          ...lines,
          `${promptString(currentDirectory)} projects`,
          ...PROJECT_LINES.map(toTerminalLower),
        ]),
      );
    } else if (lower === "exit") {
      router.push("/nogimmick");
    } else if (lower.startsWith("cd ")) {
      const dir = trimmed.slice(3).trim() || "~";
      setTerminalLines((lines) =>
        trimLines([...lines, `${promptString(currentDirectory)} ${trimmed}`]),
      );
      setCurrentDirectory(dir);
    } else if (lower === "version") {
      setTerminalLines((lines) =>
        trimLines([
          ...lines,
          `${promptString(currentDirectory)} version`,
          `chloe.os 1.2.5 (Next.js v${NEXT_VERSION})`,
          `memory usage: ${getHeapUsedMB()}, 1312MB free on /dev/uwu0`,
          `uptime: 666 days, 13:37:69`,
          `kernel: chloernel#1 SMP PREEMPT_DYNAMIC`,
        ]),
      );
    } else if (trimmed) {
      setTerminalLines((lines) =>
        trimLines([
          ...lines,
          `${promptString(currentDirectory)} ${trimmed}`,
          `Unknown command: ${trimmed}`,
        ]),
      );
    }
  }

  function handleInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  }

  useEffect(() => {
    if (!clicked || showIntro) return;
    if (step === 1) {
      let idx = 0;
      setLoginLines([]);
      const interval = setInterval(() => {
        idx++;
        setLoginLines([`login: ${username.slice(0, idx)}`]);
        if (idx === username.length) {
          clearInterval(interval);
          setTimeout(() => setStep(2), 200);
        }
      }, 120);
      return () => clearInterval(interval);
    } else if (step === 2) {
      setTimeout(() => setStep(3), 200);
    } else if (step === 3) {
      let idx = 0;
      setLoginLines([`login: ${username}`]);
      const interval = setInterval(() => {
        idx++;
        setLoginLines([
          `login: ${username}`,
          `password: ${password.slice(0, idx)}`,
        ]);
        if (idx === password.length) {
          clearInterval(interval);
          setTimeout(() => setStep(4), 200);
        }
      }, 70);
      return () => clearInterval(interval);
    } else if (step === 4) {
      setTimeout(() => setStep(5), 200);
    } else if (step >= 5) {
      setLoginLines([]);
    }
  }, [clicked, showIntro, step]);

  function renderLineWithLinks(
    line: string,
    colorClass: string,
    key: React.Key,
  ) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = line.split(urlRegex);
    return (
      <div key={key} className={colorClass}>
        {parts.map((part, i) =>
          urlRegex.test(part) ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              {part}
            </a>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          ),
        )}
      </div>
    );
  }

  function toTerminalLower(line: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    return line
      .split(urlRegex)
      .map((part) => (urlRegex.test(part) ? part : part.toLowerCase()))
      .join("");
  }

  return (
    <div className={styles.centered}>
      {!clicked ? (
        <div style={{ textAlign: "center" }}>
          <span
            className={styles.start}
            style={{ cursor: "pointer" }}
            tabIndex={0}
            role="button"
            onClick={() => {
              setClicked(true);
              setShowIntro(true);
            }}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              (setClicked(true), setShowIntro(true))
            }
            aria-label="Start terminal login animation"
          >
            ./start
          </span>
         
          <br />
          <a
            href="/nogimmick"
            className={styles.start}
            style={{
              cursor: "pointer",
              marginTop: "1rem",
              display: "inline-block",
            }}
          >
            ./i hate gimmicks
          </a>
        </div>
      ) : showIntro && step === 0 ? (
        <div
          className={styles.terminal}
          style={{ margin: "2rem 0", textAlign: "left" }}
        >
          {introLines.slice(0, revealedIntroLines).map((l, i) => {
            const colorClasses = [styles.introLinePink, styles.introLineWhite];
            const colorClass = colorClasses[i % colorClasses.length];

            const isAsciiArt = /^[@|]/.test(l) || /  /.test(l);
            return isAsciiArt ? (
              <pre
                key={i}
                className={colorClass}
                style={{
                  margin: 0,
                  fontFamily: "inherit",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                {l}
              </pre>
            ) : (
              <div key={i} className={colorClass}>
                {l}
              </div>
            );
          })}
          <div style={{ marginTop: 12 }}>
            <span style={{ opacity: introDone ? 1 : 0.6 }}>
              {introDone ? "Press any key to continue" : "Loading..."}
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.terminal}>
          {(() => {
            let allLines: string[] = [];
            if (step < 5) {
              allLines = [...loginLines];
            } else {
              allLines = [
                ...AFTER_LOGIN_LINES.slice(0, Math.max(0, step - 4)),
                ...terminalLines,
              ];
            }

            const out: React.ReactNode[] = [];
            let colorIndex = 0;
            for (let i = 0; i < allLines.length; i++) {
              const line = allLines[i];
              const colorClasses = [
                styles.introLinePink,
                styles.introLineWhite,
              ];
              const colorClass =
                colorClasses[colorIndex++ % colorClasses.length];
              out.push(renderLineWithLinks(line, colorClass, i));
            }
            return out;
          })()}
          {step >= 5 && showPrompt && (
            <span>
              <span className={styles.prompt}>
                {promptString(currentDirectory)}{" "}
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKey}
                className={styles.terminalInput}
                autoFocus
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
