import Link from "next/link";
import resume from "../public/resume.json" with { type: "json" };
export default function Home() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center font-sans bg-linear-to-r from-primary-900 to-primary-600">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16  ">
                <div className="flex flex-col items-center gap-6 text-center ">
                    <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
                        Chloe Mathews
                    </h1>
                    <p className="max-w-md text-lg justify-center text-center leading-8 text-foreground">
                        I am a {resume["personal-statement"]}
                    </p>
                    <p className="max-w-md text-lg justify-center text-center leading-8 text-foreground">
                        See my{" "}
                        <Link href={"/resume"}>
                            <code className="rounded bg-primary-300/50 px-1.5 py-0.5 font-mono text-[0.9em]">
                                resume
                            </code>
                        </Link>{" "}
                        for an overview or{" "}
                        <Link href={"/projects"}>
                            <code className="rounded bg-primary-300/50 px-1.5 py-0.5 font-mono text-[0.9em]">
                                projects
                            </code>
                        </Link>{" "}
                        for a more detailed overview of projects I&apos;ve been
                        involved in, both at work and personally.
                    </p>
                    {/*<p className="max-w-md text-lg justify-center text-center leading-8 text-foreground">
                        If you&apos;re interested in my thoughts, active
                        projects, writeups or just want to read my writing, you
                        can view my{" "}
                        <Link href={"/blog"}>
                            <code className="rounded bg-primary-300/50 px-1.5 py-0.5 font-mono text-[0.9em]">
                                blog
                            </code>
                        </Link>
                        .
                    </p>*/}
                </div>
            </main>
        </div>
    );
}
