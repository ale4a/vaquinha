import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import GroupCard from '@/components/group/GroupCard/GroupCard';
import { GroupResponseDTO } from '@/types';
import React from 'react';

export const ListGroups = ({
  loading,
  groups,
}: {
  loading: boolean;
  groups: GroupResponseDTO[];
}) => {
  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="flex flex-1 flex-col overflow-x-auto">
        {!loading &&
          groups.map(
            ({
              id,
              startsOnTimestamp,
              totalMembers,
              amount,
              crypto,
              name,
              period,
              status,
              slots,
            }) => (
              <div key={id}>
                <GroupCard
                  groupId={id}
                  startsOnTimestamp={startsOnTimestamp}
                  totalMembers={totalMembers}
                  slots={slots}
                  amount={amount}
                  crypto={crypto}
                  name={name}
                  period={period}
                  status={status}
                />
              </div>
            )
          )}
      </div>
    </>
  );
};