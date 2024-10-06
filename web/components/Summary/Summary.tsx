import React from 'react';

interface ItemsSummary {
  title: string;
  result: string;
}
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
