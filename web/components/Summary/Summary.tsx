import React from 'react';
import { ItemsSummary } from './Summary.types';

const Summary = ({ itemsSummary }: { itemsSummary: ItemsSummary[] }) => {
  return (
    <div>
      {itemsSummary.map((item) => {
        return (
          <>
            {item.title} - {item.result}
            <br />
          </>
        );
      })}
    </div>
  );
};

export default Summary;
