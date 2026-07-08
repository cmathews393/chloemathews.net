import ResumeClient from "@/app/components/ResumeClient";
import fs from "fs/promises";
import path from "path";
import Navbar from "@/app/components/Navbar";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume',
};

export default async function Page({ searchParams }: { searchParams?: Promise<{ variant?: string }> }) {
  const { variant } = (await searchParams) ?? {};
  const rawData = await fs
    .readFile(path.join(process.cwd(), 'public', 'resume.json'), 'utf8')
    .then(json => JSON.parse(json) as Record<string, any>)
    .catch(() => null);

  if (!rawData) {
    return (
      <div>
        <Navbar />
        <div className="m-auto" style={{ width: '100%', maxWidth: 960 }}>
          <p>Unable to load resume definitions.</p>
        </div>
      </div>
    );
  }

  const variantKeys = rawData?.variants && typeof rawData.variants === 'object' ? Object.keys(rawData.variants) : [];
  const variantOptions = variantKeys.map((key) => {
    const title = rawData.variants?.[key]?.title as string | undefined;
    return { key, label: title ? title.replace(/\s+Resume$/i, '') : key };
  });
  const selectedVariant = variant && variantKeys.includes(variant)
    ? variant
    : variantKeys[0];

  const resume = selectedVariant
    ? {
        basics: rawData.basics,
        education: rawData.education,
        'extra-links': {
          ...(rawData['extra-links'] ?? {}),
          ...(rawData.variants?.[selectedVariant]?.['extra-links'] ?? {}),
        },
        ...rawData.variants?.[selectedVariant],
      }
    : rawData;

  const pdfUrl = selectedVariant ? `/resume-${selectedVariant}.pdf` : '/resume.pdf';

  return (
    <div>
      <Navbar />
      <div className="m-auto" style={{ width: '100%', maxWidth: 960 }}>
        <ResumeClient
          resume={resume}
          pdfUrl={pdfUrl}
          variantKey={selectedVariant}
          variants={variantOptions}
          basePath="/resume"
        />
      </div>
    </div>
  );
}
