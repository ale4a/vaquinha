import React from 'react';
import Image from 'next/image';

const Divider = () => {
  return (
    <div className='mb-5 flex justify-center flex-col'>
      <Image 
        src="/icons/Divider.svg"
        alt='Divider'
        width={40}
        height={80}
        className='pb-2'
      />
    </div>
  );
};

export default Divider;
