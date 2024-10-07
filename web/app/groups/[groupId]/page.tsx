'use client';
// src/pages/groups/[idGroup].tsx
import { usePathname } from 'next/navigation';
import React from 'react';

const GroupDetailPage = () => {
  const pathname = usePathname();

  return (
    <div>
      <h1>Group Detail: {pathname}</h1>
    </div>
  );
};

export default GroupDetailPage;
