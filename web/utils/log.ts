import { LogLevel } from '@/types/commons';
import { stringifyObject } from '@/utils/obj';

export const printDate = () => {
  const now = new Date();
  return (
    now.getDate() +
    '/' +
    (now.getMonth() + 1) +
    `/${now.getFullYear()}::${now.toLocaleTimeString()}`
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
    // }
  };
