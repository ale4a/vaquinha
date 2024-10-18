'use client';

import { includeApi } from '@/helpers/api';
import { ReactNode } from 'react';
import Navbar from '../global/Navbar/Navbar';

declare global {
  interface Window {
    __TEST__: any;
  }
}

if (typeof window !== 'undefined') {
  console.log('updateStartsOnTimestamp loaded :P');
  window.__TEST__ = {};
  window.__TEST__.updateStartsOnTimestamp = async (
    groupId: string,
    startsOnTimestamp: number
  ) => {
    const response = await fetch(
      includeApi(`/group/${groupId}/set-timestamp`),
      {
        method: 'POST',
        body: JSON.stringify({ startsOnTimestamp }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const result = await response.json();
    if (result.success) {
      window.location.reload();
    }
    console.log(result);
  };
}

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  return (
    <div className="h-full flex justify-center bg-bg-200">
      <div className="w-full h-full sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl bg-bg-100 flex flex-col">
        {/* <div className="h-20 ">
          <MainTabsHeader />
        </div> */}
        {/* <div className="navbar bg-base-300 text-neutral-content flex-col space-y-2">
          <div className="flex-none space-x-2">
            <WalletButton />
            <ClusterUiSelect />
          </div>
        </div> */}
        <div className="flex flex-col flex-1 mx-2 overflow-y-auto">
          {children}
        </div>
        <div className="bg-gray-900">
          <Navbar links={links} />
        </div>
      </div>
    </div>
  );
}
