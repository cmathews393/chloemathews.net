import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-05-30",
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
    // Remember opt-outs from the privacy page in localStorage
    opt_out_capturing_persistence_type: "localStorage",
    debug: process.env.NODE_ENV === "development",
});
