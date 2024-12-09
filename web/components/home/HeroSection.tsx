import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/solana-provider';
import Link from 'next/link';

const HeroSection = () => {
  const { connected } = useWallet();
  return (
    <section className="text-center mt-10 px-4 pb-12 lg:pb-24 md:py-12">
      <h1 className="text-4xl font-bold">Save Together, Earn More</h1>
      <p className="text-lg mt-4">
        Join a community savings protocol powered by blockchain technology.
        {/* Contribute to a shared pool and earn bigger rewards the longer you stay. */}
      </p>
      {!connected ? (
        <div className="py-2 px-6 flex flex-col items-center ">
          <WalletButton />
        </div>
      ) : (
        <Link href={'/groups'}>
          <button className="bg-green-500 text-white py-2 px-6 rounded-full mt-6">
            Get Started
          </button>
        </Link>
      )}

      <div className="mt-8 flex justify-center">
        <Image
          src="/Saving money-amico.svg"
          alt="Saving money"
          width={500}
          height={500}
          className="max-w-full h-auto"
        />
      </div>
    </section>
  );
};

export default HeroSection;
