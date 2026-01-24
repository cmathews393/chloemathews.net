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
    const server = spawn('npm', ['run', 'start'], {
      env: { ...process.env, PORT: '3000' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (server.stdout) {
      server.stdout.on('data', (d) => process.stdout.write(d));
    }
    if (server.stderr) {
      server.stderr.on('data', (d) => process.stderr.write(d));
    }

    console.log(`Waiting for ${url} to become ready...`);
    const ready = await waitForServer(url, 30000);
    if (!ready) throw new Error('Next server did not become ready in time');

    console.log('Launching headless Chrome (puppeteer)...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Inject print-specific overrides: hide the site navbar, preserve columns, restore light-on-dark text colors,
    // and force a full-bleed layout so there is no white border in the PDF.
    await page.addStyleTag({ content: `
      @media print {
        /* Target the top site header (navbar) that contains the Home link */
        header:has(> a[href="/nogimmick"]), header[role="banner"] { display: none !important; }

        /* Page background and exact color rendering */
        html, body, #__next { margin: 0 !important; height: 100% !important; background: var(--bg) !important; -webkit-print-color-adjust: exact !important; }

        /* Make the resume container full-bleed and keep the site panel look; use box-sizing
           and full width so padding doesn't push content beyond the page edge. */
        #resume-content {
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: none !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 12px 12px !important;
          background: var(--panelGradient) !important;
          color: rgba(255,255,255,0.96) !important;
          min-height: 100vh !important;
        }

        /* Slightly narrower left column for print to give the main column more room */
        #resume-content [class*="layout"] {
          grid-template-columns: minmax(200px, 240px) 1fr !important;
          gap: 12px !important;
          align-items: start !important;
        }

        /* Reduce font sizes and improve wrapping in the main column (work / education)
           to avoid bleeding and unnatural page breaks */
        #resume-content [class*="layout"] .main {
          font-size: 10px !important;
          line-height: 1.18 !important;
          overflow-wrap: anywhere !important;
          white-space: normal !important;
          -webkit-hyphens: auto !important;
          hyphens: auto !important;
        }
        #resume-content [class*="layout"] .main .title {
          font-size: 12px !important;
        }
        #resume-content [class*="layout"] .main .subtitle,
        #resume-content [class*="layout"] .main .highlights li {
          font-size: 9px !important;
        }
        #resume-content [class*="layout"] .highlights li {
          max-width: 100% !important;
          overflow-wrap: anywhere !important;
        }
        #resume-content [class*="layout"] .workItem {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* Hide small UI elements */
        #resume-content .actions, #resume-content .linkButton { display: none !important; }
      }
    `});

    // Apply inline styles with !important to ensure they override any other print rules
    await page.evaluate(() => {
      const setImportant = (el, prop, value) => el && el.style.setProperty(prop, value, 'important');

      const header = document.querySelector('header[role="banner"]') || document.querySelector('header');
      if (header) setImportant(header, 'display', 'none');

      const container = document.querySelector('#resume-content');
      if (container) {
        setImportant(container, 'box-sizing', 'border-box');
        setImportant(container, 'width', '100%');
        setImportant(container, 'padding', '12px 12px');
        setImportant(container, 'border-radius', '0');
        setImportant(container, 'border', 'none');
        setImportant(container, 'box-shadow', 'none');
        setImportant(container, 'background', 'var(--panelGradient)');
        setImportant(container, 'color', 'rgba(255,255,255,0.96)');
        setImportant(container, 'min-height', '100vh');
      }

      const layout = document.querySelector('#resume-content [class*="layout"]');
      if (layout) {
        setImportant(layout, 'grid-template-columns', 'minmax(200px, 240px) 1fr');
        setImportant(layout, 'gap', '12px');
        setImportant(layout, 'align-items', 'start');
      }

      const main = document.querySelector('#resume-content [class*="layout"] .main');
      if (main) {
        setImportant(main, 'font-size', '10px');
        setImportant(main, 'line-height', '1.18');
        setImportant(main, 'overflow-wrap', 'anywhere');
        setImportant(main, 'white-space', 'normal');
        setImportant(main, '-webkit-hyphens', 'auto');
        setImportant(main, 'hyphens', 'auto');
      }

      document.querySelectorAll('#resume-content .workItem').forEach((el) => {
        setImportant(el, 'page-break-inside', 'avoid');
        setImportant(el, 'break-inside', 'avoid');
      });
    });

    // Emulate print media so print-specific CSS is applied
    await page.emulateMediaType('print');

    const outPath = path.join(root, 'public', 'resume.pdf');
    console.log('Rendering PDF to', outPath);
    // Render only page 1 (avoid trailing blank page), with full-bleed margins
    await page.pdf({ path: outPath, format: 'A4', printBackground: true, margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }, pageRanges: '1' });

    await browser.close();

    // kill the server process
    try {
      server.kill('SIGTERM');
    } catch {
      // ignore
    }

    // ensure file exists and report
    const stat = await fs.stat(outPath).catch(() => null);
    if (!stat) throw new Error('PDF generation failed: output not found');

    console.log('PDF generated at public/resume.pdf');
  } catch (err) {
    console.error('Failed to generate HTML PDF:', err && err.message ? err.message : err);
    process.exitCode = 1;
  }
}

main();
