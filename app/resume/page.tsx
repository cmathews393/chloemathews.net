import resume from "../../public/resume.json" with { type: "json" };
import SkillTag from "../components/SkillTag";
function formatMonth(value: string) {
    if (value === "Present") return value;
    if (/^\d{4}$/.test(value)) return value;
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });
}
function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mb-6 border-b-2 border-primary-300 pb-2 text-center text-2xl font-semibold tracking-tight text-foreground">
            {children}
        </h2>
    );
}
export default function Resume() {
    return (
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 text-foreground sm:py-24">
            <header className="mb-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight">
                    {resume.basics.name}
                </h1>
                <p className="mt-2 text-lg text-primary-300">
                    {resume.basics.label} · {resume.basics.location.address}
                </p>
                <a
                    href="/resume.pdf"
                    download
                    data-ph-capture-attribute-event="resume_download"
                    className="mt-6 inline-block rounded-md border-2 border-primary-300 px-4 py-2 font-semibold transition-colors hover:border-primary-50 hover:text-primary-50"
                >
                    Download PDF
                </a>
            </header>
            <section className="mb-16">
                <SectionHeading>Roles</SectionHeading>
                <div className="flex flex-col gap-10">
                    {resume.work.map((job) => (
                        <article key={`${job.name}-${job.startDate}`}>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                                <h3 className="text-lg font-bold tracking-tight">
                                    {job.position}{" "}
                                    <span className="font-normal text-primary-300">
                                        · {job.name}
                                    </span>
                                </h3>
                                <p className="text-sm text-primary-300">
                                    {formatMonth(job.startDate)} –{" "}
                                    {formatMonth(job.endDate)}
                                </p>
                            </div>
                            <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-primary-400">
                                {job.highlights.map((h) => (
                                    <li key={h}>{h}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
            <section className="mb-16">
                <SectionHeading>Education</SectionHeading>
                <div className="flex flex-col gap-4">
                    {resume.education.map((school) => (
                        <article
                            key={school.institution}
                            className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between"
                        >
                            <h3 className="font-bold tracking-tight">
                                {school.studyType}, {school.area}{" "}
                                <span className="font-normal text-primary-300">
                                    · {school.institution}
                                </span>
                            </h3>
                            <p className="text-sm text-primary-300">
                                {formatMonth(school.startDate)} –{" "}
                                {formatMonth(school.endDate)}
                            </p>
                        </article>
                    ))}
                </div>
            </section>
            <section className="mb-16">
                <SectionHeading>Certifications</SectionHeading>
                <ul className="flex flex-col gap-2">
                    {resume.certificates.map((cert) => (
                        <li key={cert.name}>
                            <a
                                href={cert.url}
                                data-ph-capture-attribute-certificate={cert.name}
                                className="font-bold underline underline-offset-4 transition-colors hover:text-primary-50"
                            >
                                {cert.name}
                            </a>{" "}
                            <span className="text-primary-300">
                                · {cert.issuer}, {formatMonth(cert.date)}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <SectionHeading>Skills</SectionHeading>
                <dl className="flex flex-col gap-5">
                    {resume.skills.map((group) => (
                        <div key={group.name}>
                            <dt className="font-bold tracking-tight">
                                {group.name}
                            </dt>
                            <dd className="mt-2 flex flex-wrap gap-2">
                                {group.keywords.map((skill) => (
                                    <SkillTag key={skill} skill={skill} />
                                ))}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
        </main>
    );
}
