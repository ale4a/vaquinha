/* eslint-disable no-extend-native */

declare global {
  interface Number {
    padStart(maxLength: number, fillString?: string): String,
    
    padEnd(maxLength: number, fillString?: string): String,
  }
}

Number.prototype.padStart = function (maxLength, fillString = '0') {
  return (this + '').padStart(maxLength, fillString);
};

Number.prototype.padEnd = function (maxLength, fillString = '0') {
  return (this + '').padEnd(maxLength, fillString);
};

export {};
