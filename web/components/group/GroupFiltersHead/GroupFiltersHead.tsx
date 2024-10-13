import { InputSelect } from '@/components/global/form';
import { CurrencyInputText } from '@/components/global/form/InputCurrency/InputCurrency';
import { GroupCrypto, GroupFilters, GroupPeriod } from '@/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   useDisclosure,
//   RadioGroup,
//   Radio,
// } from '@nextui-org/react';

import { FiFilter } from 'react-icons/fi';

export const GroupFiltersHead = ({
  filters,
  setFilters,
}: {
  filters: GroupFilters;
  setFilters: Dispatch<SetStateAction<GroupFilters>>;
}) => {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <button
        className="block md:hidden text-xl"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <FiFilter />
      </button>
      <div className="hidden md:flex gap-2 w-1/4">
        <InputSelect<GroupPeriod>
          label="Filter by period"
          options={[
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
          ]}
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
          className="flex-1"
        />
      </div>
      {/* <Modal isOpen={isOpen} placement={'bottom'} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-bg-200 p-4 rounded-lg w-11/12 max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Contenido del modal: otros filtros */}
            <InputSelect<GroupPeriod>
              label="Filter by period"
              options={[
                { text: 'All Period', value: GroupPeriod.ALL },
                { text: 'Monthly', value: GroupPeriod.MONTHLY },
                { text: 'Weekly', value: GroupPeriod.WEEKLY },
              ]}
              value={filters.period}
              onChange={(period) =>
                setFilters((prevState) => ({ ...prevState, period }))
              }
              size="small"
              className="mb-4"
            />
            <InputSelect
              label="Order by"
              options={[
                { text: 'Order by Amount ↑', value: '+amount' },
                { text: 'Order by Amount ↓', value: '-amount' },
                { text: 'Order by Date ↑', value: '+date' },
                { text: 'Order by Date ↓', value: '-date' },
                { text: 'Order by Total Members ↑', value: '+totalMembers' },
                { text: 'Order by Total Members ↓', value: '-totalMembers' },
              ]}
              value={filters.orderBy}
              onChange={(orderBy) =>
                setFilters((prevState) => ({ ...prevState, orderBy }))
              }
              size="small"
              className="mb-4"
            />

            {/* Botón de cerrar modal */}
            <button
              className="w-full bg-primary-500 text-white py-2 rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
