'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface ITab {
  label: string;
  value: string;
}

interface TabsComponentProps {
  tabs: ITab[];
  onTabClick: (tabValue: string) => void;
  currentTab: string;
}

const TabsComponent = ({
  tabs,
  onTabClick,
  currentTab,
}: TabsComponentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('tab')) {
      const defaultTab = tabs[0]?.value;
      if (defaultTab) {
        router.push(`${pathname}?tab=${defaultTab}`);
      }
    }
  }, [searchParams, pathname, router, tabs]);

  return (
    <div className="flex gap-8 px-2 overflow-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabClick(tab.value)}
          className={`relative px-4 py-2 font-medium ${
            currentTab === tab.value ? 'text-white' : 'text-accent-200'
          }`}
        >
          {tab.label}
          {currentTab === tab.value && (
            <span className="absolute bottom-2 left-0 w-full h-0.5 bg-primary-200"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabsComponent;
