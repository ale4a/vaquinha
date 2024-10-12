import React from 'react';
import { ItemsSummary } from './Summary.types';

const Summary = ({ itemsSummary }: { itemsSummary: ItemsSummary[] }) => {
  return (
    <div className="bg-bg-100 text-accent-100">
      <div className="my-2 p-4 border-accent-200">
        {itemsSummary.map((item, index) => (
          <div key={index} className="flex justify-between py-1">
            <span className="font-thin">{item.title}</span>
            <span>{item.result}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
