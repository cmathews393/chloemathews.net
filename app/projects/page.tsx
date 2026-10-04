import resume from "../../public/resume.json" with { type: "json" };
import AccordionItem from "../components/AccordionItem";
import SelectedSkill from "../components/SelectedSkill";
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

function SkillTags({
    skills,
    selectedSkill,
}: {
    skills: string[];
    selectedSkill?: string;
}) {
    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill) => (
                <SkillTag
                    key={skill}
                    skill={skill}
                    active={isSameSkill(skill, selectedSkill)}
                />
            ))}
        </div>
    );
}

function isSameSkill(a: string, b?: string) {
    return !!b && a.toLowerCase() === b.toLowerCase();
}

function EmptyState() {
    return (
        <p className="text-center text-primary-300">No matching projects.</p>
    );
}

export default async function Projects({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { skill } = await searchParams;
    const selectedSkill = typeof skill === "string" ? skill : undefined;
    const matchesSkill = (project: { skills: string[] }) =>
        !selectedSkill ||
        project.skills.some((s) => isSameSkill(s, selectedSkill));
    const workProjects = resume.work_projects.filter(matchesSkill);
    const personalProjects = resume.personal_projects.filter(matchesSkill);
    return (
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 text-foreground sm:py-24">
            <header className="mb-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight">
                    My Projects
                </h1>
                <p className="mt-2 text-lg text-primary-300">
                    See personal projects at the bottom!
                </p>
            </header>
            {selectedSkill && <SelectedSkill skill={selectedSkill} />}
            <section className="mb-16">
                <SectionHeading>Work Projects</SectionHeading>
                <div className="flex flex-col gap-10">
                    {workProjects.length === 0 && <EmptyState />}
                    {workProjects.map((project) => (
                        <article key={`${project.name}-${project.startDate}`}>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                                <h3 className="text-lg font-bold tracking-tight">
                                    {project.name}{" "}
                                    <span className="font-normal text-primary-300">
                                        · {project.description}
                                    </span>
                                </h3>
                                <p className="text-sm text-primary-300">
                                    {formatMonth(project.startDate)} –{" "}
                                    {formatMonth(project.endDate)}
                                </p>
                            </div>
                            <AccordionItem sectionName="Skills">
                                <SkillTags
                                    skills={project.skills}
                                    selectedSkill={selectedSkill}
                                />
                            </AccordionItem>

                            <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-primary-400">
                                {project.highlights.map((h) => (
                                    <li key={h}>{h}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
            <section className="mb-16">
                <SectionHeading>Personal Projects</SectionHeading>
                <div className="flex flex-col gap-10">
                    {personalProjects.length === 0 && <EmptyState />}
                    {personalProjects.map((project) => (
                        <article key={`${project.name}-${project.startDate}`}>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                                <h3 className="text-lg font-bold tracking-tight">
                                    {project.name}{" "}
                                    <span className="font-normal text-primary-300">
                                        · {project.description}
                                    </span>
                                </h3>
                                <p className="text-sm text-primary-300">
                                    {formatMonth(project.startDate)} –{" "}
                                    {formatMonth(project.endDate)}
                                </p>
                            </div>
                            <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-primary-400">
                                {project.highlights.map((h) => (
                                    <li key={h}>{h}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
