import React, { useMemo, useState } from 'react';
import { AxisOptions, Chart } from 'react-charts';
import { makeSeries, useDemoConfig } from './useDemoConfig';

export const Statistics = () => {
  const [graphSelectTab, setGraphSelectTab] = useState<number>(0);

  const { data, randomizeData } = useDemoConfig({
    series: 10,
    dataType: 'time',
  });

  const primaryAxis = useMemo<
    AxisOptions<(typeof data)[number]['data'][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary as unknown as Date,
    }),
    []
  );

  const secondaryAxes = useMemo<
    AxisOptions<(typeof data)[number]['data'][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

  const datas = [makeSeries(1, 'time', 14)];
  return (
    <div>
      <h1 className="text-lg font-medium">Statistics</h1>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex gap-2 w-full" onClick={() => setGraphSelectTab(0)}>
          <div className="flex-col p-2 rounded flex-1 bg-bg-200">
            <div className="text-accent-100 text-nowrap">Realtime APY</div>
            <div className="text-accent-200">12.56 %</div>
          </div>
          <div className="flex-col p-2 rounded flex-1 bg-bg-200">
            <div className="text-accent-100 text-nowrap">Historical APY</div>
            <div className="text-accent-200">12.01 %</div>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div
            className={
              'flex-col border border-primary-100 p-2 rounded flex-1' +
              (graphSelectTab === 1 ? ' bg-primary-100' : '')
            }
            onClick={() => setGraphSelectTab(1)}
          >
            <div className="text-accent-100 text-nowrap">Interest Earned</div>
            <div className="text-accent-100">$4.67</div>
          </div>
          <div
            className={
              'flex-col border border-primary-100 p-2 rounded flex-1' +
              (graphSelectTab === 2 ? ' bg-primary-100' : '')
            }
            onClick={() => setGraphSelectTab(2)}
          >
            <div className="text-accent-100">Total Value</div>
            <div className="text-accent-100">$10.0</div>
          </div>
        </div>
        {!!graphSelectTab && (
          <div className="flex w-full h-36">
            <Chart
              options={{
                data: datas,
                primaryAxis,
                secondaryAxes,
                dark: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
