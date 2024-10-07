'use client';

import { Suspense, useCallback } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (!searchParams.get('tab')) {
      const defaultTab = tabs[0]?.value;
      if (defaultTab) {
        router.replace(`${pathname}?${createQueryString('tab', defaultTab)}`);
      }
    }
  }, [searchParams, pathname, router, tabs, createQueryString]);

  const handleTabClick = (tabValue: string) => {
    router.push(`${pathname}?${createQueryString('tab', tabValue)}`);
    onTabClick(tabValue);
  };

  return (
    <div className="flex gap-8 px-2 overflow-auto">
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
            <span className="absolute bottom-2 left-0 w-full h-0.5 bg-primary-200"></span>
          )}
        </button>
      ))}
    </div>
  );
};

const TabsWithSuspense = (props: TabsComponentProps) => (
  <Suspense fallback={<LoadingSpinner />}>
    <TabsComponent {...props} />
  </Suspense>
);

export default TabsWithSuspense;
