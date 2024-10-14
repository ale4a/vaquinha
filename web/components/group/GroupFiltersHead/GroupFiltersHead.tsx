import { InputSelect } from '@/components/global/form';
import { CurrencyInputText } from '@/components/global/form/InputCurrency/InputCurrency';
import { GroupCrypto, GroupFilters, GroupPeriod } from '@/types';
import React, { Dispatch, SetStateAction } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';

import { FiFilter } from 'react-icons/fi';

const sortingOptions = [
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
];

const periodOptions = [
  {
    text: 'All Period',
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
];
export const GroupFiltersHead = ({
  filters,
  setFilters,
}: {
  filters: GroupFilters;
  setFilters: Dispatch<SetStateAction<GroupFilters>>;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex gap-2 justify-center items-center py-2">
      <CurrencyInputText
        placeHolder="Contribution Amount"
        className="flex-1 w-2/4"
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
      <button className="block md:hidden text-xl" onClick={onOpen}>
        <FiFilter />
      </button>

      <div className="hidden md:flex gap-2 w-1/4">
        <InputSelect<GroupPeriod>
          label="Filter by period"
          options={periodOptions}
          value={filters.period}
          onChange={(period) =>
            setFilters((prevState) => ({ ...prevState, period }))
          }
          size="small"
          className="flex-1 "
        />
      </div>
      <div className="hidden md:flex gap-2 w-1/4">
        <InputSelect
          label="Order by"
          options={sortingOptions}
          value={filters.orderBy}
          onChange={(orderBy) =>
            setFilters((prevState) => ({ ...prevState, orderBy }))
          }
          size="small"
          className="flex-1"
        />
      </div>
      <Modal
        isOpen={isOpen}
        placement={'bottom'}
        onOpenChange={onOpenChange}
        backdrop={'opaque'}
        style={{
          marginBottom: '0px',
        }}
        className="rounded-none rounded-t-lg"
        classNames={{
          base: 'border-bg-200 bg-bg-100',
        }}
        closeButton={false}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Filters</ModalHeader>
          <ModalBody>
            <InputSelect
              label="Order by"
              options={sortingOptions}
              value={filters.orderBy}
              onChange={(orderBy) =>
                setFilters((prevState) => ({ ...prevState, orderBy }))
              }
              size="small"
              className="flex-1"
            />
            <InputSelect<GroupPeriod>
              label="Filter by period"
              options={periodOptions}
              value={filters.period}
              onChange={(period) =>
                setFilters((prevState) => ({ ...prevState, period }))
              }
              size="small"
              className="flex-1 "
            />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
