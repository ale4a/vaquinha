import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const { connected } = useWallet();
  return (
    <header className=" sticky top-0 z-50 flex justify-between items-center mx-6 py-6 px-4 bg-bg-100 text-white shadow-bottom-custom my-6 rounded-full xl:mx-36">
      <Link href="/" className="flex gap-0.5">
        <Image src="/favicon.ico" alt="Vaquita logo" width={30} height={30} />
        <span className="font-medium text-base sm:text-xl flex justify-center text-center items-end">
          VAQUITA
        </span>
      </Link>

      <div className="flex-none space-x-1 flex wallets-buttons">
        {/* {connected && (
          <Link href={'/groups'}>
            <button className="bg-green-500 text-white py-1 px-4 rounded-full">
              Get Started
            </button>
          </Link>
        )} */}
        <WalletButton />
        <ClusterUiSelect />
      </div>
    </header>
  );
};

export default Header;
