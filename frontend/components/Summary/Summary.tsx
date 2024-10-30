import React from 'react';
import { ItemsSummary } from './Summary.types';

const Summary = ({ itemsSummary }: { itemsSummary: ItemsSummary[] }) => {
  return (
    <div className="border-dashed border border-bg-300 text-accent-100 py-2 px-4 rounded-lg">
      {itemsSummary.map((item, index) => (
        <div key={index} className="flex justify-between py-1">
          <span className="font-thin">{item.title}</span>
          <span className="text-lg">{item.result}</span>
        </div>
      ))}
    </div>
  );
};

export default Summary;
