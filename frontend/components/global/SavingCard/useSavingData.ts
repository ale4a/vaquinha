// src/hooks/useSavingData.ts
import { useQuery } from '@tanstack/react-query';
import fetchSavingData from './SavingCard.utils';
import { ISavingData } from './SavingCard.types';

export const useSavingData = (tab: string) => {
  return useQuery<ISavingData[], Error>({
    queryKey: ['savingData', tab],
    queryFn: () => fetchSavingData(tab),
  });
};
