import { LogLevel } from '@/types/commons';
import { stringifyObject } from '@/utils/obj';

export const printDate = () => {
  const now = new Date();
  return (
    now.getDate().padStart(2, '0') +
    '/' +
    (now.getMonth() + 1).padStart(2, '0') +
    `/${now.getFullYear().padStart(4, '0')}::${now.toLocaleTimeString()}`
  );
};

export const logMessage = (logLevel: LogLevel) => (message: any) => {
  // if (shouldDisplayLog(logLevel)) {
  console.log(`[MSG] ${printDate()}, ${message}`);
  // }
};

export const logError =
  (logLevel: LogLevel) => (content: any, title?: string) => {
    // if (shouldDisplayLog(logLevel)) {
    console.log(`[ERROR] ${printDate()}` + (title ? `, ${title}:` : ':'));
    console.log(stringifyObject(content, 5));
    console.log(`_______`);
    // }
  };
