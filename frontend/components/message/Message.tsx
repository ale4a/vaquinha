import Image from 'next/image';
import React from 'react';

import { MessageText } from './Message.types';

const Message = ({ messageText }: MessageText) => {
  return (
    <div className="bg-bg-200 text-accent-100">
      <div className="p-4 border-dashed border-2 border-primary-300">
        <div className="flex justify-between flex-col">
          <div className="mb-2 flex items-center">
            <Image
              src="/icons/danger.svg"
              alt="Group Active"
              width={28}
              height={28}
            />
            <p className="ml-3 font-semibold">Attention</p>
          </div>
          <span className="text-sm">{messageText}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
