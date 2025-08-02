import React from "react";

export default function CollectionTabs({ tabs, activeTab, onTabChange }) {
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex space-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`py-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === tab
                ? "border-brand-sky text-brand-sky"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
} 