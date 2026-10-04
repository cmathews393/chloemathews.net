import resume from "../../public/resume.json" with { type: "json" };
function formatMonth(value: string) {
    if (value === "Present") return value;
    if (/^\d{4}$/.test(value)) return value;
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });
}
export default function Resume() {
    return (
        <div className=" bg-background font-sans">
            <main className="py-32 px-16 bg-background ">
                <h1 className="my-2 max-w-xs text-2xl font-semibold leading-10 tracking-tight text-foreground">
                    Roles
                </h1>
                {resume.work.map((job) => (
                    <section
                        className="flex flex-col flex-1 font-sans"
                        key={job.name}
                    >
                        <h2 className="max-w-xs text-md font-extrabold leading-10 tracking-tight text-foreground">
                            {job.position} - {job.name}
                        </h2>
                        <p className="max-w-xs text-md font-semibold leading-10 tracking-tight text-foreground">
                            {formatMonth(job.startDate)} to{" "}
                            {formatMonth(job.endDate)}
                        </p>
                        <ul>
                            {job.highlights.map((h) => (
                                <li key={h}>- {h}</li>
                            ))}
                        </ul>
                    </section>
                ))}
                <h1 className="mt-8 mb-2 max-w-xs text-2xl font-semibold leading-10 tracking-tight text-foreground">
                    Education
                </h1>
                {resume.education.map((school) => (
                    <section
                        className="flex flex-col font-sans"
                        key={school.institution}
                    >
                        <h2 className="text-md font-extrabold leading-10 tracking-tight text-foreground">
                            {school.studyType}, {school.area} -{" "}
                            {school.institution}
                        </h2>
                        <p className="text-md font-semibold leading-10 tracking-tight text-foreground">
                            {formatMonth(school.startDate)} to{" "}
                            {formatMonth(school.endDate)}
                        </p>
                    </section>
                ))}
                <h1 className="mt-8 mb-2 max-w-xs text-2xl font-semibold leading-10 tracking-tight text-foreground">
                    Certifications
                </h1>
                <ul className="flex flex-col gap-2">
                    {resume.certificates.map((cert) => (
                        <li key={cert.name}>
                            <a
                                href={cert.url}
                                className="font-extrabold tracking-tight underline underline-offset-4 transition-colors hover:text-primary-50"
                            >
                                {cert.name}
                            </a>{" "}
                            - {cert.issuer}, {formatMonth(cert.date)}
                        </li>
                    ))}
                </ul>
                <h1 className="mt-8 mb-2 max-w-xs text-2xl font-semibold leading-10 tracking-tight text-foreground">
                    Skills (click a skill to see related projects!)
                </h1>
                <dl className="flex flex-col gap-3">
                    {resume.skills.map((group) => (
                        <div key={group.name}>
                            <dt className="font-extrabold tracking-tight text-foreground">
                                {group.name}
                            </dt>
                            <dd className="mt-1 flex flex-wrap gap-2">
                                {group.keywords.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full border border-primary-500 px-3 py-0.5 text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </dd>
                        </div>
                    ))}
                </dl>
            </main>
        </div>
    );
}
