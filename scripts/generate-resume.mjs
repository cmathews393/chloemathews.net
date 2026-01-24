#!/usr/bin/env node
/*
  ESM script to generate a LaTeX resume PDF from public/resume.json
  - Renders the EJS template at scripts/resume.tex.ejs
  - Attempts to compile with tectonic first, falls back to pdflatex
  - Writes output to public/resume.pdf (if compilation succeeds)
  - If no LaTeX engine is found, the script exits gracefully (non-failing)
*/

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import ejs from 'ejs';

function latexEscape(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\^{}')
    .replace(/</g, '\\textless{}')
    .replace(/>/g, '\\textgreater{}');
}

function paraify(s) {
  if (!s) return '';
  return String(s)
    .split(/\r?\n\r?\n/)
    .map((p) => latexEscape(p).replace(/\r?\n/, ' '))
    .join('\n\n');
}

function fmtDate(v) {
  if (!v) return '';
  if (v === 'Present') return 'Present';
  if (/^\d{4}$/.test(v)) return v;
  if (/^\d{4}-\d{2}$/.test(v)) {
    const [y, m] = v.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[m - 1]} ${y}`;
  }
  return latexEscape(v);
}

async function main() {
  const root = process.cwd();
  const publicJson = path.join(root, 'public', 'resume.json');
  const tplPath = path.join(root, 'scripts', 'resume.tex.ejs');
  const buildDir = path.join(root, 'tmp', 'resume-build');

  try {
    const raw = await fs.readFile(publicJson, 'utf8');
    const resume = JSON.parse(raw);

    const data = {
      basics: {
        name: latexEscape(resume?.basics?.name ?? ''),
        email: latexEscape(resume?.basics?.email ?? ''),
        url: latexEscape(resume?.basics?.url ?? ''),
        location: { address: latexEscape(resume?.basics?.location?.address ?? '') },
      },
      personalStatement: paraify(resume?.['personal-statement'] ?? ''),
      work: (resume?.work ?? []).map((w) => ({
        name: latexEscape(w.name ?? ''),
        position: latexEscape(w.position ?? ''),
        startDate: fmtDate(w.startDate),
        endDate: fmtDate(w.endDate),
        dateRange: [fmtDate(w.startDate), fmtDate(w.endDate)].filter(Boolean).join(' -- '),
        highlights: (w.highlights ?? []).map((h) => latexEscape(h)),
      })),
      skills: (resume?.skills ?? []).map((s) => ({ name: latexEscape(s.name ?? ''), keywords: (s.keywords ?? []).map((k) => latexEscape(k)) })),
      education: (resume?.education ?? []).map((ed) => ({
        institution: latexEscape(ed.institution ?? ''),
        area: latexEscape(ed.area ?? ''),
        studyType: latexEscape(ed.studyType ?? ''),
        startDate: fmtDate(ed.startDate),
        endDate: fmtDate(ed.endDate),
        startEnd: [fmtDate(ed.startDate), fmtDate(ed.endDate)].filter(Boolean).join(' -- '),
        score: latexEscape(ed.score ?? ''),
      })),
      achievements: (resume?.achievements ?? []).map((a) => ({ text: latexEscape(a.text ?? '') })),
    };

    const tpl = await fs.readFile(tplPath, 'utf8');
    const tex = ejs.render(tpl, data);

    await fs.rm(buildDir, { recursive: true, force: true });
    await fs.mkdir(buildDir, { recursive: true });
    const texPath = path.join(buildDir, 'resume.tex');
    await fs.writeFile(texPath, tex, 'utf8');

    // Check for available engines
    let engine = null;
    try {
      execSync('tectonic --version', { stdio: 'ignore' });
      engine = 'tectonic';
    } catch {}

    if (!engine) {
      try {
        execSync('pdflatex --version', { stdio: 'ignore' });
        engine = 'pdflatex';
      } catch {}
    }

    if (!engine) {
      console.warn('No LaTeX engine found (tectonic or pdflatex). Skipping resume PDF generation.');
      return;
    }

    console.log(`Compiling with ${engine}...`);
    try {
      if (engine === 'tectonic') {
        execSync('tectonic resume.tex', { cwd: buildDir, stdio: 'inherit' });
      } else {
        execSync('pdflatex -interaction=nonstopmode -halt-on-error resume.tex', { cwd: buildDir, stdio: 'inherit' });
        execSync('pdflatex -interaction=nonstopmode -halt-on-error resume.tex', { cwd: buildDir, stdio: 'inherit' });
      }

      const srcPdf = path.join(buildDir, 'resume.pdf');
      const destPdf = path.join(root, 'public', 'resume.pdf');
      await fs.copyFile(srcPdf, destPdf);
      console.log('PDF generated at public/resume.pdf');
    } catch (err) {
      console.warn('LaTeX compilation failed, skipping PDF output:', err && err.message ? err.message : err);
    }
  } catch (err) {
    console.warn('Failed to generate resume PDF:', err && err.message ? err.message : err);
  }
}

main();
