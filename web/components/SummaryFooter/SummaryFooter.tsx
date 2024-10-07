import React from 'react';
import { ItemsSummary } from './SummaryFooter.types'; // Asegúrate de que la ruta sea correcta

const SummaryFooter = ({ itemsSummary }: { itemsSummary: ItemsSummary[] }) => {
  return (
    <div className='mx-3 bg-bg-100'>
      <div className='mt-20 py-4 px-3 border-dashed border-2 border-bg-300'>
        {itemsSummary.map((item, index) => (
          <div key={index} className='flex justify-between py-2'>
            <span>{item.title}</span>
            <span>{item.result}</span>
          </div>
        ))}
      </div>    
    </div>
  );
};

export default SummaryFooter;
