'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface ITab {
  label: string;
  value: string;
}

const TabsComponent = ({ tabs }: { tabs: ITab[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || tabs[0]?.value;

  const handleTabClick = (tabValue: string) => {
    const newUrl = `${pathname}?tab=${tabValue}`;
    router.push(newUrl);
  };

  useEffect(() => {
    if (!searchParams.get('tab')) {
      const defaultTab = tabs[0]?.value;
      if (defaultTab) {
        router.replace(`${pathname}?tab=${defaultTab}`);
      }
    }
  }, [searchParams, pathname, router, tabs]);

  return (
    <div className="w-full">
      <div className="flex justify-between border-b border-accent-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`relative px-4 py-2 font-medium ${
              currentTab === tab.value ? 'text-white' : 'text-accent-200'
            }`}
          >
            {tab.label}
            {currentTab === tab.value && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-200"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsComponent;
