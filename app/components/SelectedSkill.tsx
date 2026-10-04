import Link from "next/link";

export default function SelectedSkill({ skill }: { skill: string }) {
    return (
        <p className="mb-12 text-center text-primary-300">
            Showing projects using{" "}
            <span className="font-bold text-foreground">{skill}</span> ·{" "}
            <Link
                href="/projects"
                className="underline underline-offset-4 transition-colors hover:text-primary-50"
            >
                Clear filter
            </Link>
        </p>
    );
}
