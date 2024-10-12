import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const MainTabsHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="text-primary-200 text-3xl text-center flex justify-around items-center gap-2 pt-4 pb-2 h-14">
      {pathname.split('/').length > 2 && (
        <button onClick={handleBack}>
          <Image
            src="/icons/back-arrow.svg"
            alt="Groups Active"
            width={28}
            height={28}
          />
        </button>
      )}
      <div className="flex flex-1 justify-between items-center">
        <p className="font-medium text-3xl">Vaquinha</p>
        <div className="flex-none space-x-1 flex wallets-buttons">
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>
    </div>
  );
};

export default MainTabsHeader;
