import { InputSelect } from '@/components/global/form';
import { CurrencyInputText } from '@/components/global/form/InputCurrency/InputCurrency';
import { GroupCrypto, GroupFilters, GroupPeriod } from '@/types';
import React, { Dispatch, SetStateAction } from 'react';

export const GroupFiltersHead = ({
  filters,
  setFilters,
}: {
  filters: GroupFilters;
  setFilters: Dispatch<SetStateAction<GroupFilters>>;
}) => {
  return (
    <div className="flex gap-2 justify-center items-center py-2">
      <CurrencyInputText
        label="Filter by amount"
        className="flex-1 w-1/3"
        size="small"
        options={[
          {
            text: 'USDC',
            value: GroupCrypto.USDC,
          },
          {
            text: 'SOL',
            value: GroupCrypto.SOL,
          },
        ]}
        value={filters.amount}
        onChange={(amount) =>
          setFilters((prevState) => ({ ...prevState, amount }))
        }
        optionValue={filters.crypto}
        onChangeOption={(crypto) =>
          setFilters((prevState) => ({ ...prevState, crypto }))
        }
      />
      <InputSelect<GroupPeriod>
        label="Filter by period"
        options={[
          {
            text: 'All',
            value: GroupPeriod.ALL,
          },
          {
            text: 'Monthly',
            value: GroupPeriod.MONTHLY,
          },
          {
            text: 'Weekly',
            value: GroupPeriod.WEEKLY,
          },
        ]}
        value={filters.period}
        onChange={(period) =>
          setFilters((prevState) => ({ ...prevState, period }))
        }
        size="small"
        className="flex-1 w-1/3"
      />
      <InputSelect
        label="Order by"
        options={[
          {
            text: 'Amount ↑',
            value: '+amount',
          },
          {
            text: 'Amount ↓',
            value: '-amount',
          },
          {
            text: 'Date ↑',
            value: '+date',
          },
          {
            text: 'Date ↓',
            value: '-date',
          },
          // {
          //   text: 'Slots ↑',
          //   value: '+slots',
          // },
          // {
          //   text: 'Slots ↓',
          //   value: '-slots',
          // },
          {
            text: 'Total Members ↑',
            value: '+totalMembers',
          },
          {
            text: 'Total Members ↓',
            value: '-totalMembers',
          },
        ]}
        value={filters.orderBy}
        onChange={(orderBy) =>
          setFilters((prevState) => ({ ...prevState, orderBy }))
        }
        size="small"
        className="flex-1 w-1/3"
      />
    </div>
  );
};
