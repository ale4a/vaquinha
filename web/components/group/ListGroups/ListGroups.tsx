import LoadingSpinner from '@/components/global/LoadingSpinner/LoadingSpinner';
import GroupCard from '@/components/group/GroupCard/GroupCard';
import { GroupResponseDTO } from '@/types';
import Image from 'next/image';
import React from 'react';

export const ListGroups = ({
  loading,
  groups,
  myGroups,
}: {
  loading: boolean;
  groups: GroupResponseDTO[];
  myGroups?: boolean;
}) => {
  const isEmpty = !loading && groups.length === 0;
  console.log({ groups });
  return (
    <>
      {loading && <LoadingSpinner />}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-8 h-3/4">
          <Image
            src="/icons/empty.svg"
            alt="Lista vacía"
            width={100}
            height={100}
            className="mb-4"
          />
          <p className=" text-center">
            {myGroups ? (
              <>
                {"You haven't created any groups yet."} <br />
                Start one now!
              </>
            ) : (
              <>
                There are no groups yet. <br /> Come back soon!
              </>
            )}
          </p>
        </div>
      )}

      {!!groups.length && (
        <div className="flex flex-1 flex-col overflow-x-auto sm:overflow-visible gap-4 pt-1 pb-4">
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
      )}
    </>
  );
};
