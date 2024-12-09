import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const MainTabsHeader = () => {
  return (
    <div className="text-white text-3xl text-center flex justify-around items-center gap-2 pt-6 pb-2 lg:hidden">
      <div className="flex flex-1 flex-wrap justify-between items-center">
        <Link className="flex gap-0.5" href={'/'}>
          <Image
            src="/favicon.ico"
            alt="Groups Active"
            width={30}
            height={15}
          />
          <span className="font-medium text-xl text-end flex justify-end items-end ">
            VAQUITA
          </span>
        </Link>
        <div className="flex-none space-x-1 flex wallets-buttons">
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>
    </div>
  );
};

export default MainTabsHeader;
