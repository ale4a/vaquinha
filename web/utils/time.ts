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

export const getTimeElapsedSince = (timestamp: number): string => {
  const now = Date.now();
  const difference = now - timestamp;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds}s ago`;
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 30) {
    return `${days}d ago`;
  } else if (months < 12) {
    return `${months}mo ago`;
  } else {
    return `${years}y ago`;
  }
};
