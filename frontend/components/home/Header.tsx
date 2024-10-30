import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const { connected } = useWallet();
  return (
    <header className="w-full sticky top-0 z-50 flex justify-between items-center px-4 py-6 bg-bg-100 text-white shadow-bottom-custom">
      <Link href="/" className="flex gap-0.5">
        <Image src="/favicon.ico" alt="Vaquita logo" width={30} height={30} />
        <span className="font-medium text-xl text-end flex justify-end items-end ">
          VAQUITA
        </span>
      </Link>

      <div className="flex-none space-x-1 flex wallets-buttons">
        {connected && (
          <Link href={'/groups'}>
            <button className="bg-green-500 text-white py-1 px-4 rounded-full hidden sm:inline-block">
              Get Started
            </button>
          </Link>
        )}

        <WalletButton />
        <ClusterUiSelect />
      </div>
    </header>
  );
};

export default Header;
