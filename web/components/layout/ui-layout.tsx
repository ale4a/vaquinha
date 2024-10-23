'use client';

import { includeApi } from '@/helpers/api';
import { ReactNode, useState } from 'react';
import { BsCalendar2Date } from 'react-icons/bs';
import Navbar from '../global/Navbar/Navbar';

declare global {
  interface Window {
    __TEST__: any;
  }
}

if (typeof window !== 'undefined') {
  console.log('updateStartsOnTimestamp loaded :D');
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
  const [loading, setLoading] = useState(false);

  return (
    <div
      className="h-full flex justify-center"
      onDoubleClick={() => setLoading(!loading)}
      onDrag={() => {
        setLoading(!loading);
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="w-full h-full bg-bg-100 flex flex-col">
        {loading ? (
          <div className="flex items-center h-full w-full justify-center">
            <BsCalendar2Date className="animate-ping" size={128} />
          </div>
        ) : (
          <>
            <div className="hidden sm:block bg-gray-900 z-10">
              <Navbar links={links} />
            </div>
            <div
              className="flex flex-col flex-1 overflow-y-auto sm:px-20 md:px-28 lg:px-32 xl:px-36 2xl:px-44 "
              style={{ maxHeight: 'calc(100vh - 5rem)' }}
            >
              {children}
            </div>
            <div className="block sm:hidden bg-gray-900 ">
              <Navbar links={links} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
