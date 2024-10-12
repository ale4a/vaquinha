import React from 'react';
import StatusCompleted from './completed/StatusCompleted';
import Divider from './Divider/Divider';
import StatusStarted from './started/StatusStarted';

interface BuildingStatusProps {
  value1: boolean;
  value2: boolean;
  label2?: string;
  value3: boolean;
  label3?: string;
}

const BuildingStatus = ({
  value1,
  value2,
  label2 = 'Pending Group',
  value3,
  label3 = 'Active Group',
}: BuildingStatusProps) => {
  const statusNameFirst = 'Collateral Deposited';
  return (
    <div className="flex justify-evenly text-accent-200">
      {value1 ? (
        <>
          <StatusCompleted nameStatus={statusNameFirst} />
        </>
      ) : (
        <>
          <StatusStarted nameStatus={statusNameFirst} />
        </>
      )}
      <Divider className={value1 ? 'border-primary-200' : ''} />
      {value2 ? (
        <>
          <StatusCompleted nameStatus={label2} />
        </>
      ) : (
        <>
          <StatusStarted nameStatus={label2} />
        </>
      )}
      <Divider className={value2 ? 'border-primary-200' : ''} />
      {value3 ? (
        <>
          <StatusCompleted nameStatus={label3} />
        </>
      ) : (
        <>
          <StatusStarted nameStatus={label3} />
        </>
      )}
    </div>
  );
};

export default BuildingStatus;
