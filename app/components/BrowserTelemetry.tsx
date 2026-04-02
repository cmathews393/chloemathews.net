'use client';

import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import type { Sampler, SamplingResult, Context, Attributes, Link } from "@opentelemetry/api";
import { SamplingDecision, SpanKind } from "@opentelemetry/api";

const apiKey = process.env.NEXT_PUBLIC_HONEYCOMB_API_KEY;

// resourceFetch spans for these URL patterns are low-value noise.
// We keep them only if they have an error status (handled by the sampler
// not having duration info at start-time — those land in the catch below).
const SUPPRESS_RESOURCE_PATTERNS = [
  '/_next/static/',
  '.woff2',
  '.woff',
  'cloudflare',
  '/.netlify/scripts/rum',
  'email-decode.min.js',
];

class ResourceFetchSampler implements Sampler {
  shouldSample(
    _context: Context,
    _traceId: string,
    spanName: string,
    _spanKind: SpanKind,
    attributes: Attributes,
    _links: Link[]
  ): SamplingResult {
    if (spanName === 'resourceFetch') {
      const url = String(attributes['http.url'] ?? '');
      if (SUPPRESS_RESOURCE_PATTERNS.some(p => url.includes(p))) {
        return { decision: SamplingDecision.NOT_RECORD };
      }
    }
    return { decision: SamplingDecision.RECORD_AND_SAMPLED };
  }

  toString(): string {
    return 'ResourceFetchSampler';
  }
}

export function BrowserTelemetry() {
  // Only run in the browser and only when a key is configured.
  if (typeof window === 'undefined' || !apiKey) {
    return null;
  }

  try {
    const webSDK = new HoneycombWebSDK({
      serviceName: 'chloemathews.net-frontend',
      apiKey,
      sampler: new ResourceFetchSampler(),
      instrumentations: [getWebAutoInstrumentations()],
    });
    webSDK.start();
  } catch (e) {
    // Do not re-throw — a telemetry failure must never affect the UI.
    console.error(e);
  }

  return null;
}