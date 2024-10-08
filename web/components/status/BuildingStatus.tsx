import React from 'react';

import Image from 'next/image';
import StatusStarted from './started/StatusStarted';
import StatusCompleted from './completed/StatusCompleted';
import Divider from './Divider/Divider';

interface BuildingStatusProps {
    value1: boolean;
    value2: boolean;
    value3: boolean;
}


const BuildingStatus = ({ value1, value2, value3 }: BuildingStatusProps) => {
    const statusNameFirst = "Dispositiv Collateral"
    const statusNameSecond = "Pending Group"
    const statusNameThird = "Active Group"
    return (
      <div className='flex justify-evenly'>
          {value1 ? (
                <>
                    <StatusCompleted nameStatus={statusNameFirst} />
                </>
            ) : (
                <>
                    <StatusStarted nameStatus={statusNameFirst} />
                </>
            )}
            <Divider />
            {value2 ? (
                <>
                    <StatusCompleted nameStatus={statusNameSecond} />
                </>
            ) : (
                <>
                    <StatusStarted nameStatus={statusNameSecond} />
                </>
            )}
            <Divider />
            {value3 ? (
                <>
                    <StatusCompleted nameStatus={statusNameThird} />
                </>
            ) : (
                <>
                    <StatusStarted nameStatus={statusNameThird} />
                </>
            )}
      </div>
    );
};

export default BuildingStatus;
