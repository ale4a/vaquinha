import Image from 'next/image';
import React from 'react';
import { NameStatus } from './Started.types';

const StatusStarted = ({ nameStatus }: NameStatus) => {
  return (
    <div className="flex justify-evenly py-2 px-2">
      <div className="mb-5 flex items-center flex-col text-center">
        <Image
          src="/icons/circle-status-started.svg"
          alt="Group Active"
          width={28}
          height={28}
          className="pb-2"
        />
        <span className="text-s">{nameStatus}</span> {}
      </div>
    </div>
  );
};

export default StatusStarted;
