'use client';

import { WalletButton } from '../solana/solana-provider';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AccountChecker } from '../account/account-ui';
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../global/Navbar/Navbar';

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="h-full flex justify-center bg-black">
      <div className="w-[375px] h-full bg-bg-100 flex flex-col">
        {/* <div className="navbar bg-base-300 text-neutral-content flex-col space-y-2">
          <div className="flex-none space-x-2">
            <WalletButton />
            <ClusterUiSelect />
          </div>
        </div> */}
        {children}

        <Navbar links={links} />
      </div>
    </div>
  );
}