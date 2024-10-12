import { ISavingData } from './SavingCard.types';

const dummyDataUSDT: ISavingData[] = [
  {
    groupId: 'usdt-1',
    name: 'El Pasanaku',
    amount: 68,
    collateral: 341,
    startIn: '10-10-2024',
    peopleCount: 3,
    period: 'monthly',
  },
  {
    groupId: 'usdt-2',
    name: 'El Pasanaku 2',
    amount: 120,
    collateral: 400,
    startIn: '15-10-2024',
    peopleCount: 5,
    period: 'monthly',
  },
  {
    groupId: 'usdt-3',
    name: 'El Pasanaku 3',
    amount: 90,
    collateral: 350,
    startIn: '20-10-2024',
    peopleCount: 4,
    period: 'monthly',
  },
  {
    groupId: 'usdt-4',
    name: 'El Pasanaku 4',
    amount: 100,
    collateral: 380,
    startIn: '25-10-2024',
    peopleCount: 6,
    period: 'monthly',
  },
];

const dummyDataSOL: ISavingData[] = [
  {
    groupId: 'sol-1',
    name: 'El Sol Pasanaku',
    amount: 68,
    collateral: 341,
    startIn: '10-10-2024',
    peopleCount: 3,
    period: 'monthly',
  },
  {
    groupId: 'sol-2',
    name: 'El Sol Pasanaku 2',
    amount: 120,
    collateral: 400,
    startIn: '15-10-2024',
    peopleCount: 5,
    period: 'monthly',
  },
];
const fetchSavingData = async (tab: string): Promise<ISavingData[]> => {
  // TODO: ADD in the query tabs, like USDC, SOL, ETC
  const savingData = await fetch('/api/group').then((res) => res.json());
  return savingData.contents;
};
export default fetchSavingData;
