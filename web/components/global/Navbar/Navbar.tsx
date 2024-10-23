import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type LinkItem = {
  label: string;
  path: string;
};

type NavbarProps = {
  links: LinkItem[];
};

const getIcon = (label: string, isActive: boolean) => {
  switch (label) {
    case 'Join Group':
      return isActive ? (
        <Image
          src="/icons/groups-active.svg"
          alt="Groups Active"
          width={24}
          height={24}
        />
      ) : (
        <Image
          src="/icons/groups-disabled.svg"
          alt="Groups Disabled"
          width={24}
          height={24}
        />
      );
    case 'My Groups':
      return isActive ? (
        <Image
          src="/icons/my-groups-active.svg"
          alt="My Groups Active"
          width={30}
          height={24}
        />
      ) : (
        <Image
          src="/icons/my-groups-disabled.svg"
          alt="My Groups Disabled"
          width={30}
          height={24}
        />
      );
    case 'On-ramp':
      return isActive ? (
        <Image
          src="/icons/on-ramp-active.svg"
          alt="On-ramp Active"
          width={30}
          height={30}
        />
      ) : (
        <Image
          src="/icons/on-ramp-disabled.svg"
          alt="On-ramp Disabled"
          width={30}
          height={30}
        />
      );
    case 'Profile':
      return isActive ? (
        <Image
          src="/icons/profile-active.svg"
          alt="Profile Active"
          width={24}
          height={24}
        />
      ) : (
        <Image
          src="/icons/profile-disabled.svg"
          alt="Profile Disabled"
          width={24}
          height={24}
        />
      );
    case 'Dashboard':
      return isActive ? (
        <Image
          src="/icons/dashboard-active.svg"
          alt="Profile Active"
          width={24}
          height={24}
        />
      ) : (
        <Image
          src="/icons/dashboard-disabled.svg"
          alt="Profile Disabled"
          width={24}
          height={24}
        />
      );
    default:
      return null;
  }
};

const Navbar: React.FC<NavbarProps> = ({ links }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);
  const mainPath = '/' + pathSegments[0];

  return (
    <nav className="bottom-0 w-full bg-bg-100 text-white shadow-top-custom sm:shadow-bottom-custom sm:flex sm:items-center sm:gap-6 sm:px-4">
      <div className="flex items-center flex-1 gap-6">
        <Link className="hidden sm:flex gap-0.5" href={'/'}>
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
        <ul className="h-20 flex justify-around items-center pt-5 pb-3 flex-1 sm:gap-4 sm:justify-start">
          {links.map(({ label, path }) => {
            const isActive = mainPath === path;
            return (
              <li key={label} className="text-center flex-1 sm:flex-initial">
                <Link
                  href={path}
                  className={`flex flex-col sm:flex-row sm:gap-1 items-center ${
                    isActive
                      ? 'text-primary-200'
                      : 'text-gray-400 hover:text-primary-200'
                  }`}
                >
                  {getIcon(label, isActive)}
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="hidden sm:flex space-x-1 wallets-buttons">
        <WalletButton />
        <ClusterUiSelect />
      </div>
    </nav>
  );
};

export default Navbar;
