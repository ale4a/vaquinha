import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinkItem = {
  label: string;
  path: string;
};

type NavbarProps = {
  links: LinkItem[];
};

const getIcon = (label: string, isActive: boolean) => {
  switch (label) {
    case 'Groups':
      return isActive ? (
        <Image
          src="/icons/groups-active.svg"
          alt="Groups Active"
          width={28}
          height={28}
        />
      ) : (
        <Image
          src="/icons/groups-disabled.svg"
          alt="Groups Disabled"
          width={28}
          height={28}
        />
      );
    case 'My Groups':
      return isActive ? (
        <Image
          src="/icons/my-groups-active.svg"
          alt="My Groups Active"
          width={37}
          height={37}
        />
      ) : (
        <Image
          src="/icons/my-groups-disabled.svg"
          alt="My Groups Disabled"
          width={37}
          height={37}
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
          width={32}
          height={32}
        />
      ) : (
        <Image
          src="/icons/profile-disabled.svg"
          alt="Profile Disabled"
          width={32}
          height={32}
        />
      );
    default:
      return null;
  }
};

const Navbar: React.FC<NavbarProps> = ({ links }) => {
  const pathname = usePathname();

  return (
    <nav className=" bottom-0 w-full bg-bg-100 text-white shadow-top-custom">
      <ul className="h-20 flex justify-around items-center py-4">
        {links.map(({ label, path }) => {
          const isActive = pathname === path;

          return (
            <li key={label} className="text-center">
              <Link
                href={path}
                className={`flex flex-col items-center ${
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
    </nav>
  );
};

export default Navbar;
