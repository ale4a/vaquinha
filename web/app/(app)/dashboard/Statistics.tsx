import { useState } from 'react';

export const Statistics = () => {
  const [graphSelectTab, setGraphSelectTab] = useState<number>(0);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2" onClick={() => setGraphSelectTab(0)}>
        <div className="flex-col border border-primary-100 p-2 rounded w-36">
          <div className="text-accent-100 text-nowrap">Realtime APY</div>
          <div className="text-accent-200">12.56 %</div>
        </div>
        <div className="flex-col border border-primary-100 p-2 rounded w-36">
          <div className="text-accent-100 text-nowrap">Historical APY</div>
          <div className="text-accent-200">12.01 %</div>
        </div>
      </div>
      <div className="flex gap-2">
        <div
          className={
            'flex-col border border-primary-100 p-2 rounded w-36  ' +
            (graphSelectTab === 1 ? 'bg-primary-100' : '')
          }
          onClick={() => setGraphSelectTab(1)}
        >
          <div className="text-accent-100 text-nowrap">Interest Earned</div>
          <div className="text-accent-100">$4.67</div>
        </div>
        <div
          className={
            'flex-col border border-primary-100 p-2 rounded w-36 ' +
            (graphSelectTab === 2 ? 'bg-primary-100' : '')
          }
          onClick={() => setGraphSelectTab(2)}
        >
          <div className="text-accent-100">Total Value</div>
          <div className="text-accent-100">$10.0</div>
        </div>
      </div>
    </div>
  );
};
