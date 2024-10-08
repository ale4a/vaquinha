import React from 'react';
import { ItemsSummary} from './Summary.types';

const Summary = ({ itemsSummary }: { itemsSummary: ItemsSummary[] }) => {
  return (
    <div className='mx-3 bg-bg-100'>
      <div className='my-2 py-2 px-3 border-dashed border-2 border-bg-300'>
        {itemsSummary.map((item, index) => (
          <div key={index} className='flex justify-between py-1.5'>
            <span>{item.title}</span>
            <span>{item.result}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
