import Image from 'next/image';
import React from 'react';
import { Completed } from './Completed';

const StatusCompleted = ({ nameStatus }: Completed) => {
  return (
    <div className="flex justify-evenly py-2 px-2">
      <div className="mb-5 flex items-center flex-col text-center">
        <Image
          src="/icons/circle-status-completed.svg"
          alt="Group Active"
          width={28}
          height={28}
          className="pb-2"
        />
        <span className="text-x text-primary-200">{nameStatus}</span>
      </div>
    </div>
  );
};

export default StatusCompleted;
