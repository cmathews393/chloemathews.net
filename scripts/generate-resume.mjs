#!/usr/bin/env node
/*
  Generates plain black-on-white resume PDFs from public/resume.json using pdfkit.
  - Writes public/resume-<variant>.pdf for each entry in resume.variants
  - Copies the first variant to public/resume.pdf (renders the base resume there
    when no variants exist)
*/

import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const MARGIN = 54; // 0.75in
const BODY_SIZE = 10;

function fmtDate(v) {
  if (!v) return '';
  if (v === 'Present') return 'Present';
  if (/^\d{4}$/.test(v)) return v;
  if (/^\d{4}-\d{2}$/.test(v)) {
    const [y, m] = v.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[m - 1]} ${y}`;
  }
  return String(v);
}

function dateRange(start, end) {
  return [fmtDate(start), fmtDate(end)].filter(Boolean).join(' – ');
}

function mergeVariant(base, variant) {
  return {
    basics: base.basics,
    education: base.education,
    'extra-links': {
      ...(base['extra-links'] ?? {}),
      ...(variant?.['extra-links'] ?? {}),
    },
    ...variant,
  };
}

function renderResume(doc, resume) {
  const contentWidth = doc.page.width - MARGIN * 2;

  const section = (title) => {
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(12).text(title, MARGIN);
    const y = doc.y + 1;
    doc.moveTo(MARGIN, y).lineTo(doc.page.width - MARGIN, y).lineWidth(0.5).strokeColor('black').stroke();
    doc.y = y + 6;
  };

  // Bold left text with a right-aligned date on the same line
  const rowWithDates = (left, dates) => {
    const startY = doc.y;
    doc.font('Helvetica-Bold').fontSize(11);
    const leftWidth = contentWidth - 110;
    const leftHeight = doc.heightOfString(left, { width: leftWidth });
    doc.text(left, MARGIN, startY, { width: leftWidth });
    if (dates) {
      doc.font('Helvetica').fontSize(BODY_SIZE).text(dates, MARGIN, startY + 1, { width: contentWidth, align: 'right' });
    }
    doc.y = startY + leftHeight;
  };

  const bullets = (items) => {
    doc.font('Helvetica').fontSize(BODY_SIZE);
    for (const item of items) {
      doc.text('•', MARGIN + 4, doc.y, { continued: false, lineBreak: false });
      doc.text(item, MARGIN + 16, doc.y, { width: contentWidth - 16, lineGap: 1 });
      doc.moveDown(0.15);
    }
  };

  // Keep a work/education entry's heading from landing at the very bottom of a page
  const ensureSpace = (needed) => {
    if (doc.y + needed > doc.page.height - MARGIN) doc.addPage();
  };

  const basics = resume.basics ?? {};
  doc.font('Helvetica-Bold').fontSize(20).fillColor('black').text(basics.name ?? '', MARGIN, MARGIN, { width: contentWidth, align: 'center' });
  if (basics.label) {
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(11).text(basics.label, { width: contentWidth, align: 'center' });
  }
  const contact = [basics.location?.address, basics.email, basics.url, basics.linkedin]
    .filter(Boolean)
    .map((v) => String(v).replace(/^https?:\/\//, ''))
    .join('   |   ');
  if (contact) {
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(BODY_SIZE).text(contact, { width: contentWidth, align: 'center' });
  }

  const statement = String(resume['personal-statement'] ?? '').trim();
  if (statement) {
    section('Summary');
    doc.font('Helvetica').fontSize(BODY_SIZE).text(statement, { width: contentWidth, lineGap: 1 });
  }

  const work = resume.work ?? [];
  if (work.length) {
    section('Work Experience');
    work.forEach((w, i) => {
      if (i > 0) doc.moveDown(0.7);
      ensureSpace(60);
      const heading = [w.position, w.name].filter(Boolean).join(' — ');
      rowWithDates(heading, dateRange(w.startDate, w.endDate));
      doc.moveDown(0.2);
      if (w.highlights?.length) bullets(w.highlights);
    });
  }

  const education = resume.education ?? [];
  if (education.length) {
    section('Education');
    education.forEach((ed, i) => {
      if (i > 0) doc.moveDown(0.5);
      ensureSpace(40);
      rowWithDates(ed.institution ?? '', dateRange(ed.startDate, ed.endDate));
      const detail = [ed.studyType, ed.area, ed.score].filter(Boolean).join(' • ');
      if (detail) doc.font('Helvetica').fontSize(BODY_SIZE).text(detail, MARGIN, doc.y + 2, { width: contentWidth });
    });
  }

  const skills = resume.skills ?? [];
  if (skills.length) {
    section('Skills');
    skills.forEach((s, i) => {
      if (i > 0) doc.moveDown(0.3);
      doc.font('Helvetica-Bold').fontSize(BODY_SIZE).text(`${s.name ?? ''}: `, MARGIN, doc.y, { continued: true, width: contentWidth });
      doc.font('Helvetica').text((s.keywords ?? []).join(', '));
    });
  }

  const achievements = resume.achievements ?? [];
  if (achievements.length) {
    section('Achievements');
    bullets(achievements.map((a) => a.text ?? ''));
  }

  const extraLinks = Object.values(resume['extra-links'] ?? {}).filter((l) => l?.text);
  if (extraLinks.length) {
    doc.moveDown(1.2);
    doc.font('Helvetica').fontSize(9);
    for (const l of extraLinks) {
      doc.text(l.text, MARGIN, doc.y, { width: contentWidth, link: l.link || undefined });
    }
  }
}

function writePdf(resume, outPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: { Title: `${resume?.basics?.name ?? 'Resume'} — Resume` },
    });
    const stream = createWriteStream(outPath);
    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.pipe(stream);
    renderResume(doc, resume);
    doc.end();
  });
}

async function main() {
  const root = process.cwd();
  const publicDir = path.join(root, 'public');
  const resume = JSON.parse(await fs.readFile(path.join(publicDir, 'resume.json'), 'utf8'));

  const variantEntries = resume?.variants && typeof resume.variants === 'object'
    ? Object.entries(resume.variants)
    : [];

  if (variantEntries.length) {
    const outputs = [];
    for (const [key, variant] of variantEntries) {
      const outPath = path.join(publicDir, `resume-${key}.pdf`);
      await writePdf(mergeVariant(resume, variant), outPath);
      outputs.push(outPath);
      console.log(`PDF generated at public/resume-${key}.pdf`);
    }
    await fs.copyFile(outputs[0], path.join(publicDir, 'resume.pdf'));
    console.log('Copied first variant to public/resume.pdf');
  } else {
    await writePdf(resume, path.join(publicDir, 'resume.pdf'));
    console.log('PDF generated at public/resume.pdf');
  }
}

main().catch((err) => {
  console.error('Failed to generate resume PDFs:', err?.message ?? err);
  process.exit(1);
});
