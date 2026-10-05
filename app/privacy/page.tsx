import type { Metadata } from "next";
import resume from "../../public/resume.json" with { type: "json" };
import AnalyticsOptOut from "../components/AnalyticsOptOut";

export const metadata: Metadata = {
    title: "Privacy Policy | Chloe Mathews",
};

const LAST_UPDATED = "October 5, 2026";

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mb-4 border-b-2 border-primary-300 pb-2 text-2xl font-semibold tracking-tight text-foreground">
            {children}
        </h2>
    );
}

function ExternalLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            className="underline decoration-primary-300 underline-offset-2 hover:text-primary-50"
        >
            {children}
        </a>
    );
}

export default function Privacy() {
    const email = resume.basics.email;
    return (
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 leading-relaxed text-foreground sm:py-24">
            <header className="mb-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight">
                    Privacy Policy
                </h1>
                <p className="mt-2 text-lg text-primary-300">
                    Last updated {LAST_UPDATED}
                </p>
            </header>

            <section className="mb-12">
                <SectionHeading>Who I am</SectionHeading>
                <p>
                    This is the personal portfolio site of Chloe Mathews. I am
                    responsible for the data described here. For questions or
                    requests about your data, email{" "}
                    <ExternalLink href={`mailto:${email}`}>{email}</ExternalLink>
                    .
                </p>
            </section>

            <section className="mb-12">
                <SectionHeading>What I collect</SectionHeading>
                <p>
                    There are no accounts or forms here, and I don&apos;t ask
                    for your name or email. I use analytics to see how the site
                    is used. When you visit, the following is collected
                    automatically:
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-primary-400">
                    <li>
                        Pages you view, the page that referred you, and URL
                        parameters such as <code>?ref=resume</code>
                    </li>
                    <li>Links and elements you click</li>
                    <li>
                        Browser, operating system, device type, and screen size
                    </li>
                    <li>
                        Your IP address, which is used to estimate your
                        approximate location (country and city)
                    </li>
                    <li>Page load performance (web vitals)</li>
                    <li>JavaScript errors that occur while you browse</li>
                    <li>
                        Session recordings, only if an error occurs during your
                        visit: a replay of your mouse movement, scrolling,
                        clicks, and the page content you saw, which may include
                        activity leading up to the error
                    </li>
                    <li>
                        A random identifier stored in your browser so repeat
                        visits can be grouped together
                    </li>
                </ul>
            </section>

            <section className="mb-12">
                <SectionHeading>Why I collect it</SectionHeading>
                <p>
                    I use this data to understand which pages are useful, to
                    find and fix bugs, and to keep the site fast. I don&apos;t
                    sell it, use it for advertising, or try to identify
                    individual visitors. For visitors covered by the GDPR or
                    UK GDPR, the legal basis is my legitimate interest in
                    running and improving the site.
                </p>
            </section>

            <section className="mb-12">
                <SectionHeading>Who processes it</SectionHeading>
                <ul className="list-disc space-y-1.5 pl-5 marker:text-primary-400">
                    <li>
                        <strong>PostHog</strong> (product analytics, hosted in
                        the United States).{" "}
                        <ExternalLink href="https://posthog.com/privacy">
                            Privacy policy
                        </ExternalLink>
                    </li>
                    <li>
                        <strong>Netlify</strong> (hosting only; Netlify&apos;s
                        analytics and performance monitoring are turned off).{" "}
                        <ExternalLink href="https://www.netlify.com/privacy/">
                            Privacy policy
                        </ExternalLink>
                    </li>
                    <li>
                        <strong>Cloudflare</strong> (network delivery only;
                        Cloudflare Web Analytics is turned off).{" "}
                        <ExternalLink href="https://www.cloudflare.com/privacypolicy/">
                            Privacy policy
                        </ExternalLink>
                    </li>
                </ul>
                <p className="mt-3">
                    Like any web host, Netlify and Cloudflare see your IP
                    address and standard request details when they serve the
                    site, and may keep them briefly in their logs for security
                    and reliability. They don&apos;t run analytics scripts in
                    your browser.
                </p>
                <p className="mt-3">
                    If you visit from outside the United States, your data is
                    transferred to and processed in the United States.
                </p>
            </section>

            <section className="mb-12">
                <SectionHeading>Cookies and local storage</SectionHeading>
                <p>
                    PostHog stores a random identifier in a cookie and in your
                    browser&apos;s local storage. It is used only for analytics
                    on this site. You can clear it at any time in your browser
                    settings. Content blockers and privacy-focused browsers
                    will usually stop it from being set.
                </p>
            </section>

            <section className="mb-12">
                <SectionHeading>Opting out</SectionHeading>
                <p>
                    You can turn off analytics and session recordings for this
                    site below. Your choice is saved in this browser&apos;s
                    local storage, so it applies until you clear your site
                    data or turn analytics back on. PostHog is the only
                    analytics on this site, so this turns off all of it.
                </p>
                <AnalyticsOptOut />
            </section>

            <section className="mb-12">
                <SectionHeading>How long I keep it</SectionHeading>
                <p>
                    Analytics data, including session recordings, is kept for
                    up to 90 days and then deleted. I don&apos;t export or keep
                    separate copies.
                </p>
            </section>

            <section className="mb-12">
                <SectionHeading>Your rights</SectionHeading>
                <p>
                    Depending on where you live, you may have the right to
                    access, correct, or delete data about you, or to object to
                    its processing. Email{" "}
                    <ExternalLink href={`mailto:${email}`}>{email}</ExternalLink>{" "}
                    and I&apos;ll respond within 30 days. Since I don&apos;t
                    collect names, it helps to include the approximate date
                    and time of your visit. You also have the right to
                    complain to your local data protection authority.
                </p>
            </section>

            <section>
                <SectionHeading>Changes</SectionHeading>
                <p>
                    If I change how this site handles data, I&apos;ll update
                    this page and the date at the top.
                </p>
            </section>
        </main>
    );
}
