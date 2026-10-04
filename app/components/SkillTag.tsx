import Link from "next/link";

export default function SkillTag({
    skill,
    active = false,
}: {
    skill: string;
    active?: boolean;
}) {
    return (
        <Link
            href={{ pathname: "/projects", query: { skill } }}
            aria-current={active ? "true" : undefined}
            className={`rounded-full border px-3 py-0.5 text-sm transition-colors hover:border-primary-300 hover:bg-primary-800/60 ${
                active
                    ? "border-primary-300 bg-primary-700/60"
                    : "border-primary-500 bg-primary-900/40"
            }`}
        >
            {skill}
        </Link>
    );
}
