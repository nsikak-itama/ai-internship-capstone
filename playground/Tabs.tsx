"use client";

import { useRef, useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activateTab = (index: number) => {
    setActiveTab(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    }

    if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      activateTab(nextIndex);
    }
  };

  const activeTabData = tabs[activeTab];

  return (
    <div>
      <div role="tablist" aria-label="Example tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={tab.id}
            aria-selected={activeTab === index}
            aria-controls={`${tab.id}-panel`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${activeTabData.id}-panel`}
        aria-labelledby={activeTabData.id}
        tabIndex={0}
      >
        {activeTabData.content}
      </div>
    </div>
  );
}