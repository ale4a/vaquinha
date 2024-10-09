import Button from '@/components/global/ButtonComponent/ButtonComponent';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="text-primary-200 text-4xl text-center flex justify-around items-center h-full px-4">
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
      <div className="flex flex-1 justify-between">
        <p className="font-medium">Vaquinha</p>
        <div className="flex">
          <Button label="Select wallet" type="outline" />
        </div>
      </div>
    </div>
  );
};

export default Header;
