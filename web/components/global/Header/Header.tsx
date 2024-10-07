import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="text-primary-200 text-4xl text-center flex justify-around items-center h-full">
      <button onClick={handleBack}>
        <Image
          src="/icons/back-arrow.svg"
          alt="Groups Active"
          width={28}
          height={28}
        />
      </button>
      <p className="font-medium">Vaquinha</p>
      <Image
        src="/icons/add-group.svg"
        alt="Groups Active"
        width={28}
        height={28}
        className="invisible"
      />
    </div>
  );
};

export default Header;
