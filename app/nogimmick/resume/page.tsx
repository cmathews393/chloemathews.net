import ResumeClient from "@/app/components/ResumeClient";
import fs from "fs/promises";
import path from "path";
import Navbar from "@/app/components/Navbar";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume',
};

async function getPdfUrl(): Promise<string | null> {
  try {
    const resp = await fetch(
      'https://api.github.com/repos/cmathews393/chloemathews.net/releases/latest',
      { next: { revalidate: 3600 } }
    );
    if (resp.ok) {
      const data = await resp.json();
      const asset = (data.assets ?? []).find(
        (a: { name?: string; browser_download_url?: string }) => a.name === 'resume.pdf'
      );
      if (asset?.browser_download_url) return asset.browser_download_url as string;
    }
  } catch {
    // fall through to local file check
  }

  try {
    await fs.access(path.join(process.cwd(), 'public', 'resume.pdf'));
    return '/resume.pdf';
  } catch {
    return null;
  }
}

export default async function Page() {
  const [resume, pdfUrl] = await Promise.all([
    fs.readFile(path.join(process.cwd(), 'public', 'resume.json'), 'utf8')
      .then(json => JSON.parse(json) as Record<string, unknown>)
      .catch(() => null),
    getPdfUrl(),
  ]);

  return (
    <div>
      <Navbar />
      <div className="m-auto" style={{ width: '100%', maxWidth: 960 }}>
        <ResumeClient resume={resume} pdfUrl={pdfUrl} />
      </div>
    </div>
  );
}
