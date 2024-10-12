import { ONE_DAY, ONE_HOUR, ONE_MINUTE } from '@/config/constants';

export const getRelativeTime = (relativeTime: number) => {
  const rtf1 = new Intl.RelativeTimeFormat('en', {
    style: 'short',
    numeric: 'auto',
  });
  const days = Math.floor(relativeTime / ONE_DAY);
  const hours = Math.floor((relativeTime % ONE_DAY) / ONE_HOUR);
  const minutes = Math.floor(
    ((relativeTime % ONE_DAY) % ONE_HOUR) / ONE_MINUTE
  );

  if (days) {
    return rtf1.format(days, 'day');
  }
  if (hours) {
    return rtf1.format(hours, 'hour');
  }
  return rtf1.format(minutes, 'minute');
};
