"use client";
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
