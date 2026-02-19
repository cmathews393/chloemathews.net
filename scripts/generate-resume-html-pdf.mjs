#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import puppeteer from 'puppeteer';

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return true;
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  const root = process.cwd();
  const url = 'http://localhost:3000/nogimmick/resume';

  try {
    console.log('Building Next app...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('Starting Next server (npm run start)...');
    // Start the server in a new process group (detached) so we can reliably kill it and any children
    const server = spawn('npm', ['run', 'start'], {
      env: { ...process.env, PORT: '3000' },
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    });

    // Pipe logs for debugging
    if (server.stdout) server.stdout.on('data', (d) => process.stdout.write(d));
    if (server.stderr) server.stderr.on('data', (d) => process.stderr.write(d));

    // Cleanup helper: kill process group on exit or interruption
    const cleanup = () => {
      try {
        if (server && server.pid) {
          // kill the whole process group
          process.kill(-server.pid, 'SIGTERM');
        }
      } catch {
        try {
          if (server && !server.killed) server.kill('SIGTERM');
        } catch {
          // ignore
        }
      }
    };

    process.on('SIGINT', () => {
      cleanup();
      process.exit(130);
    });
    process.on('SIGTERM', () => {
      cleanup();
      process.exit(143);
    });

    console.log(`Waiting for ${url} to become ready...`);
    const ready = await waitForServer(url, 30000);
    if (!ready) throw new Error('Next server did not become ready in time');

    console.log('Launching headless Chrome (puppeteer)...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Use a desktop-width viewport so the resume's CSS breakpoint keeps the two-column layout
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Inject print-specific overrides: hide the site navbar, preserve columns, restore light-on-dark text colors,
    // and force a full-bleed layout so there is no white border in the PDF.
    await page.addStyleTag({
      content: `
      @media print {
        /* Target the top site header (navbar) that contains the Home link */
        header:has(> a[href="/nogimmick"]), header[role="banner"] { display: none !important; }

      
      }
    `});

    // Apply inline styles with !important to ensure they override any other print rules
    await page.evaluate(() => {
      const setImportant = (el, prop, value) => el && el.style.setProperty(prop, value, 'important');

      const header = document.querySelector('header[role="banner"]') || document.querySelector('header');
      if (header) setImportant(header, 'display', 'none');

    });


    // Emulate print media so print-specific CSS is applied
    await page.emulateMediaType('print');

    // wait for webfonts to finish loading so layout/metrics match the on-page rendering
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    });

    const outPath = path.join(root, 'public', 'resume.pdf');
    console.log('Rendering PDF to', outPath);
    // Render only page 1 (avoid trailing blank page), with full-bleed margins
    await page.pdf({ path: outPath, format: 'A4', printBackground: true, margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }, pageRanges: '1' });

    await browser.close();

    // Ensure the server is terminated (kill process group)
    cleanup();

    // ensure file exists and report
    const stat = await fs.stat(outPath).catch(() => null);
    if (!stat) throw new Error('PDF generation failed: output not found');

    console.log('PDF generated at public/resume.pdf');
  } catch (err) {
    console.error('Failed to generate HTML PDF:', err && err.message ? err.message : err);
    // ensure we clean up the server before exiting
    try { process.kill(process.pid, 'SIGTERM'); } catch { }
    process.exitCode = 1;
  }
}

main();
