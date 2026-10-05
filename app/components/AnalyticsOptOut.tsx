"use client";
import posthog from "posthog-js";
import { useSyncExternalStore } from "react";

// PostHog doesn't emit an event when opt-out changes, so notify subscribers ourselves
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export default function AnalyticsOptOut() {
    const optedOut = useSyncExternalStore(
        subscribe,
        () => posthog.has_opted_out_capturing(),
        () => null,
    );

    const toggleOptOut = () => {
        if (optedOut) {
            posthog.opt_in_capturing();
        } else {
            posthog.opt_out_capturing();
        }
        listeners.forEach((listener) => listener());
    };

    // Opt-out state lives in localStorage, so it's unknown until hydration
    if (optedOut === null) return null;

    return (
        <div className="mt-4 flex flex-col items-start gap-2">
            <p className="text-primary-300">
                Analytics are currently{" "}
                <strong className="text-foreground">
                    {optedOut ? "off" : "on"}
                </strong>{" "}
                in this browser.
            </p>
            <button
                onClick={toggleOptOut}
                className="rounded border border-primary-300 bg-primary-800 px-4 py-2 font-semibold transition-colors hover:bg-primary-700 hover:text-primary-50"
            >
                {optedOut ? "Turn analytics back on" : "Opt out of analytics"}
            </button>
        </div>
    );
}
