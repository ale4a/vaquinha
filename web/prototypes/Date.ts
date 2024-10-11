/* eslint-disable no-extend-native */

declare global {
  interface Date {
    changeYear(year: number): Date;
    
    changeMonth(monthIndex: number): Date;
    
    changeDay(date: number): Date;
    
    changeHours(hours: number): Date;
    
    changeMinutes(minutes: number): Date;
    
    changeSeconds(seconds: number): Date;
    
    changeMilliseconds(milliseconds: number): Date;
    
    decreaseYear(count?: number): Date;
    
    increaseYear(count?: number): Date;
    
    decreaseMonth(): Date;
    
    increaseMonth(): Date;
    
    decreaseDay(): Date;
    
    increaseDay(): Date;
    
    startOfYear(): Date;
    
    endOfYear(): Date;
    
    startOfMonth(): Date;
    
    endOfMonth(): Date;
    
    startOfWeek(): Date;
    
    endOfWeek(): Date;
    
    startOfDay(): Date;
    
    endOfDay(): Date;
    
    startOfHour(): Date;
    
    endOfHour(): Date;
    
    startOfMinute(): Date;
    
    endOfMinute(): Date;
    
    startOfSecond(): Date;
    
    endOfSecond(): Date;
    
    isSameYear(date: Date): boolean;
    
    isSameMonth(date: Date): boolean;
    
    isSameDay(date: Date): boolean;
    
    isSameHour(date: Date): boolean;
    
    isSameMinute(date: Date): boolean;
    
    isSameSecond(date: Date): boolean;
    
    isSameMillisecond(date: Date): boolean;
    
    isToday(): boolean;
    
    isEqual(date: Date): boolean;
    
    isValidDate(): boolean;
    
    isYearAfter(date: Date): boolean;
    
    isMonthAfter(date: Date): boolean;
    
    isDayAfter(date: Date): boolean;
    
    isHoursAfter(date: Date): boolean;
    
    isMinutesAfter(date: Date): boolean;
    
    isSecondsAfter(date: Date): boolean;
    
    isMillisecondsAfter(date: Date): boolean;
    
    isAfter(date: Date): boolean;
    
    isYearBefore(date: Date): boolean;
    
    isMonthBefore(date: Date): boolean;
    
    isDayBefore(date: Date): boolean;
    
    isHoursBefore(date: Date): boolean;
    
    isMinutesBefore(date: Date): boolean;
    
    isSecondsBefore(date: Date): boolean;
    
    isMillisecondsBefore(date: Date): boolean;
    
    isBefore(date: Date): boolean;
    
    isWithinInterval(props: { start: Date, end: Date }, cmp?: '[]' | '()' | '[)' | '(]'): boolean;
  }
}

Date.prototype.changeYear = function (year: number) {
  const newDate = new Date(this);
  newDate.setFullYear(year);
  return newDate;
};

Date.prototype.changeMonth = function (monthIndex: number) {
  const newDate = new Date(this);
  newDate.setMonth(monthIndex);
  return newDate;
};

Date.prototype.changeDay = function (date: number) {
  const newDate = new Date(this);
  newDate.setDate(date);
  return newDate;
};

Date.prototype.changeHours = function (hours: number) {
  const newDate = new Date(this);
  newDate.setHours(hours);
  return newDate;
};

Date.prototype.changeMinutes = function (minutes: number) {
  const newDate = new Date(this);
  newDate.setMinutes(minutes);
  return newDate;
};

Date.prototype.changeSeconds = function (seconds: number) {
  const newDate = new Date(this);
  newDate.setSeconds(seconds);
  return newDate;
};

Date.prototype.changeMilliseconds = function (milliseconds: number) {
  const newDate = new Date(this);
  newDate.setMilliseconds(milliseconds);
  return newDate;
};

Date.prototype.decreaseYear = function (count: number = 1) {
  return this.changeYear(this.getFullYear() - count);
};

Date.prototype.increaseYear = function (count: number = 1) {
  return this.changeYear(this.getFullYear() + count);
};

Date.prototype.decreaseMonth = function () {
  const newDate = new Date(this);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
};

Date.prototype.increaseMonth = function () {
  const newDate = new Date(this);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
};

Date.prototype.increaseDay = function () {
  const newDate = new Date(this);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

Date.prototype.decreaseDay = function () {
  const newDate = new Date(this);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

Date.prototype.startOfYear = function () {
  const newDate = new Date(this);
  newDate.setMonth(0);
  return newDate.startOfMonth();
};

Date.prototype.endOfYear = function () {
  const nextMonth = this.increaseYear().startOfYear();
  return new Date(nextMonth.getTime() - 1);
};

Date.prototype.startOfMonth = function () {
  const newDate = new Date(this);
  newDate.setDate(1);
  return newDate.startOfDay();
};

Date.prototype.endOfMonth = function () {
  const nextMonth = this.increaseMonth().startOfMonth();
  return new Date(nextMonth.getTime() - 1);
};

Date.prototype.startOfWeek = function () {
  const newDate = new Date(this);
  while (newDate.getDay()) {
    newDate.setDate(newDate.getDate() - 1);
  }
  return newDate.startOfDay();
};

Date.prototype.endOfWeek = function () {
  const newDate = new Date(this);
  while (newDate.getDay() < 6) {
    newDate.setDate(newDate.getDate() - 1);
  }
  return newDate.endOfDay();
};

Date.prototype.startOfDay = function () {
  const newDate = new Date(this);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

Date.prototype.endOfDay = function () {
  const newDate = new Date(this);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

Date.prototype.startOfHour = function () {
  const newDate = new Date(this);
  newDate.setMinutes(0, 0, 0);
  return newDate;
};

Date.prototype.endOfHour = function () {
  const newDate = new Date(this);
  newDate.setMinutes(59, 59, 999);
  return newDate;
};

Date.prototype.startOfMinute = function () {
  const newDate = new Date(this);
  newDate.setSeconds(0, 0);
  return newDate;
};

Date.prototype.endOfMinute = function () {
  const newDate = new Date(this);
  newDate.setSeconds(59, 999);
  return newDate;
};

Date.prototype.startOfSecond = function () {
  const newDate = new Date(this);
  newDate.setMilliseconds(0);
  return newDate;
};

Date.prototype.endOfSecond = function () {
  const newDate = new Date(this);
  newDate.setMilliseconds(999);
  return newDate;
};

Date.prototype.isToday = function () {
  const today = new Date();
  return this.isSameDay(today);
};

Date.prototype.isEqual = function (date) {
  return this.getTime() === date.getTime();
};

Date.prototype.isSameYear = function (date) {
  return this.getFullYear() === date.getFullYear();
};

Date.prototype.isSameMonth = function (date) {
  return this.isSameYear(date) && this.getMonth() === date.getMonth();
};

Date.prototype.isSameDay = function (date) {
  return this.isSameMonth(date) && this.getDate() === date.getDate();
};

Date.prototype.isSameHour = function (date) {
  return this.isSameDay(date) && this.getHours() === date.getHours();
};

Date.prototype.isSameMinute = function (date) {
  return this.isSameHour(date) && this.getMinutes() === date.getMinutes();
};

Date.prototype.isSameSecond = function (date) {
  return this.isSameMinute(date) && this.getSeconds() === date.getSeconds();
};

Date.prototype.isSameMillisecond = function (date) {
  return this.isEqual(date);
};

Date.prototype.isValidDate = function () {
  return this instanceof Date && !isNaN(this.getTime());
};

Date.prototype.isYearAfter = function (date) {
  return this.getFullYear() > date.getFullYear();
};

Date.prototype.isMonthAfter = function (date) {
  return this.isYearAfter(date) || (this.isSameYear(date) && this.getMonth() > date.getMonth());
};

Date.prototype.isDayAfter = function (date) {
  return this.isMonthAfter(date) || (this.isSameMonth(date) && this.getDate() > date.getDate());
};

Date.prototype.isHoursAfter = function (date) {
  return this.isDayAfter(date) || (this.isSameDay(date) && this.getHours() > date.getHours());
};

Date.prototype.isMinutesAfter = function (date) {
  return this.isHoursAfter(date) || (this.isSameHour(date) && this.getMinutes() > date.getMinutes());
};

Date.prototype.isSecondsAfter = function (date) {
  return this.isMinutesAfter(date) || (this.isSameMinute(date) && this.getSeconds() > date.getSeconds());
};

Date.prototype.isMillisecondsAfter = function (date) {
  return this.isSecondsAfter(date) || (this.isSameSecond(date) && this.getMilliseconds() > date.getMilliseconds());
};

Date.prototype.isAfter = function (date) {
  return this.getTime() > date.getTime();
};

Date.prototype.isYearBefore = function (date) {
  return this.getFullYear() < date.getFullYear();
};

Date.prototype.isMonthBefore = function (date) {
  return this.isYearBefore(date) || (this.isSameYear(date) && this.getMonth() < date.getMonth());
};

Date.prototype.isDayBefore = function (date) {
  return this.isMonthBefore(date) || (this.isSameMonth(date) && this.getDate() < date.getDate());
};

Date.prototype.isHoursBefore = function (date) {
  return this.isDayBefore(date) || (this.isSameDay(date) && this.getHours() < date.getHours());
};

Date.prototype.isMinutesBefore = function (date) {
  return this.isHoursBefore(date) || (this.isSameHour(date) && this.getMinutes() < date.getMinutes());
};

Date.prototype.isSecondsBefore = function (date) {
  return this.isMinutesBefore(date) || (this.isSameMinute(date) && this.getSeconds() < date.getSeconds());
};

Date.prototype.isMillisecondsBefore = function (date) {
  return this.isSecondsBefore(date) || (this.isSameSecond(date) && this.getMilliseconds() < date.getMilliseconds());
};

Date.prototype.isBefore = function (date) {
  return this.getTime() < date.getTime();
};

Date.prototype.isWithinInterval = function ({ start, end }, cmp = '[]') {
  return (cmp.charAt(0) === '[' ? this.isEqual(start) || this.isAfter(start) : this.isAfter(start)) &&
    (cmp.charAt(1) === '[' ? this.isEqual(end) || this.isBefore(end) : this.isBefore(end));
};

export {};
