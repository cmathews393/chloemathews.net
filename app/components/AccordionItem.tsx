"use client";
import posthog from "posthog-js";
import { useState } from "react";

export default function AccordionItem({
    sectionName,
    children,
}: {
    sectionName: string;
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
        posthog.capture("accordion_toggled", { sectionName, open: !isOpen });
    };
    return (
        <div className="accordion-item">
            <button onClick={toggleAccordion} className="accordion-header">
                {isOpen ? "▼ Hide" : "▶ Show"} {sectionName}
            </button>

            {isOpen && <div>{children}</div>}
        </div>
    );
}
