import { NEXT_PUBLIC_API } from '@/config/settings';

export const includeApi = (route: string) => {
  return `${NEXT_PUBLIC_API}/vaquita/api/v1${route}`;
};
