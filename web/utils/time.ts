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

  const seconds = Math.floor(
    (((relativeTime % ONE_DAY) % ONE_HOUR) % ONE_MINUTE) / 1000
  );

  if (days) {
    return rtf1.format(days, 'day');
  }
  if (hours) {
    return rtf1.format(hours, 'hour');
  }
  if (minutes) {
    return rtf1.format(minutes, 'minute');
  }
  return rtf1.format(seconds, 'second');
};
