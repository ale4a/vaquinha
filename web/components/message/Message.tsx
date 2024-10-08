import React from 'react';

import { MessageText} from './Message.types';
import Image from 'next/image';

const Message = ({ messageText }: MessageText) => {
  return (
    <div className='mx-3 bg-bg-200'>
      <div className='py-2 px-3 border-dashed border border-primary-300'>
        <div className='flex justify-between py-2 flex-col'>
            <div className='mb-4 flex items-center'>
                <Image 
                    src="/icons/danger.svg"
                    alt='Group Active'
                    width={28}
                    height={28}
                />
                <p className='ml-3'>Attention</p>
            </div>
          <span className='text-sm'>{ messageText}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
