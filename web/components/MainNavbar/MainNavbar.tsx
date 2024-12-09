'use client';

import { ClusterUiSelect } from '@/components/cluster/cluster-ui';
import { WalletButton } from '@/components/solana/solana-provider';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';
import {
  DashboardActiveIcon,
  DashboardIcon,
  GroupsActiveIcon,
  GroupsIcon,
  MyGroupsActiveIcon,
  MyGroupsIcon,
} from './icons';
import ButtonComponent from '../global/ButtonComponent/ButtonComponent';
import { useRouter } from 'next/navigation';

const getIcon = (label: string, isActive: boolean) => {
  switch (label) {
    case 'Join Group':
      return isActive ? <GroupsActiveIcon /> : <GroupsIcon />;
    case 'My Groups':
      return isActive ? <MyGroupsActiveIcon /> : <MyGroupsIcon />;
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
      return isActive ? <DashboardActiveIcon /> : <DashboardIcon />;
    default:
      return null;
  }
};

const MainNavbar = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);
  const mainPath = '/' + pathSegments[0];
  const myGroups = useSearchParams().get('myGroups');
  const router = useRouter();

  const links: { label: string; path: string; isActive: boolean }[] = [
    {
      label: 'Join Group',
      path: '/groups',
      isActive: myGroups !== 'true' && mainPath === '/groups',
    },
    {
      label: 'My Groups',
      path: '/my-groups',
      isActive: myGroups === 'true' || mainPath === '/my-groups',
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      isActive: mainPath === '/dashboard',
    },
  ];

  return (
    <nav className="bottom-0 w-full bg-bg-100 text-white shadow-top-custom lg:shadow-bottom-custom lg:flex lg:items-center lg:gap-6 lg:px-4">
      <div className="flex items-center flex-1 gap-6">
        <Link className="hidden lg:flex gap-0.5" href={'/'}>
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
        <ul className="h-20 flex justify-around items-center pt-5 pb-3 flex-1 lg:gap-4 lg:justify-start">
          {links.map(({ label, path, isActive }) => {
            return (
              <li
                key={label}
                className="text-center flex-1 lg:flex-initial lg:flex lg:h-full"
              >
                <Link
                  href={path}
                  className={`flex flex-col lg:flex-row lg:gap-1 items-center transition-colors duration-500 ${
                    isActive ? 'text-primary-200' : 'text-gray-400'
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

      <div className="hidden lg:flex space-x-1 wallets-buttons">
        <ButtonComponent
          label="Create Group"
          type="primary"
          size="small"
          className="mr-2"
          onClick={() => router.push('/my-groups/create')}
          icon="plus"
        />
        <WalletButton />
        <ClusterUiSelect />
      </div>
    </nav>
  );
};

export default MainNavbar;
