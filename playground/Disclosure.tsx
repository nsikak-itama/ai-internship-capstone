"use client";

import { useId, useState } from "react";

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export default function Disclosure({
  title,
  children,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);

  const contentId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
      >
        {title}
      </button>

      <div id={contentId} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
}