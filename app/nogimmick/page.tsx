"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css";
import Navbar from "@/components/Navbar";
import { ABOUT_LINES } from "@/data/site";
export default function Page() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Chloe Mathews</h1>
          <h4>DevOps Engineer, Python Developer</h4>
        </div>

        <div className={styles.card}>
          {Array.isArray(ABOUT_LINES) ? (
            ABOUT_LINES.map((line, i) => <p key={i}>{line}</p>)
          ) : (
            <p>{ABOUT_LINES}</p>
          )}
        </div>
      </div>
    </div>
  );
}
