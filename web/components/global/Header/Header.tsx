import Image from 'next/image';
import React from 'react';

const Header = () => {
  return (
    <div className="text-primary-200 text-4xl text-center flex justify-around items-center h-full">
      <Image
        src="/icons/back-arrow.svg"
        alt="Groups Active"
        width={28}
        height={28}
      />
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
