import { ISavingData } from './SavingCard.types';

const dummyDataUSDT: ISavingData[] = [
  {
    groupId: 'usdt-1', // Se añade el identificador único
    name: 'El Pasanaku',
    amount: 68,
    collateral: 341,
    startIn: '10-10-2024',
    peopleCount: 3,
    period: 'monthly',
  },
  {
    groupId: 'usdt-2', // Se añade el identificador único
    name: 'El Pasanaku 2',
    amount: 120,
    collateral: 400,
    startIn: '15-10-2024',
    peopleCount: 5,
    period: 'monthly',
  },
  {
    groupId: 'usdt-3', // Se añade el identificador único
    name: 'El Pasanaku 3',
    amount: 90,
    collateral: 350,
    startIn: '20-10-2024',
    peopleCount: 4,
    period: 'monthly',
  },
  {
    groupId: 'usdt-4', // Se añade el identificador único
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
    groupId: 'sol-1', // Se añade el identificador único
    name: 'El Sol Pasanaku',
    amount: 68,
    collateral: 341,
    startIn: '10-10-2024',
    peopleCount: 3,
    period: 'monthly',
  },
  {
    groupId: 'sol-2', // Se añade el identificador único
    name: 'El Sol Pasanaku 2',
    amount: 120,
    collateral: 400,
    startIn: '15-10-2024',
    peopleCount: 5,
    period: 'monthly',
  },
];
const fetchSavingData = async (tab: string): Promise<ISavingData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (tab === 'usdt') resolve(dummyDataUSDT);
      else resolve(dummyDataSOL);
    }, 1000); // Simular retraso
  });
};
export default fetchSavingData;
