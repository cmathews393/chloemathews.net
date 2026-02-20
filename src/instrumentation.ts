import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

let sdk: NodeSDK | undefined;

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const apiKey = process.env.HONEYCOMB_API_KEY ?? process.env.NEXT_PUBLIC_HONEYCOMB_API_KEY;

  if (!apiKey) {
    console.warn("Honeycomb API key is missing; OpenTelemetry will not start.");
    return;
  }

  sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: "https://api.honeycomb.io/v1/traces",
      headers: { "X-Honeycomb-Team": apiKey },
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    serviceName: "chloemathews.net-backend",
  });

  try {
    await sdk.start();
  } catch (error) {
    console.error("Failure in instrumentation", error);
    return;
  }

}