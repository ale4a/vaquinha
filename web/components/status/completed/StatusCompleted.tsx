import Image from 'next/image';
import React from 'react';
import { Completed } from './Completed';

const StatusCompleted = ({ nameStatus }: Completed) => {
  return (
    <div className="flex justify-evenly w-full">
      <div className="flex items-center flex-col text-center">
        <Image
          src="/icons/circle-status-completed.svg"
          alt="Group Active"
          width={28}
          height={28}
          className="pb-2"
        />
        <span className="text-sm text-primary-200">{nameStatus}</span>
      </div>
    </div>
  );
};

export default StatusCompleted;
