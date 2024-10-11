import { WithId } from 'mongodb';

export enum LogLevel {
  FATAL = 'FATAL',
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
}

export enum EntityState {
  RELEASED = 'RELEASED',
  ARCHIVED = 'ARCHIVED',
}

export interface EntityOwnerDocument {
  ownerUserId: string;
}

export interface EntityTimestampsDocument {
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityStateDocument {
  state: EntityState;
}

export declare enum LogOperation {
  REMOVE = 'REMOVE',
  ADD = 'ADD',
  UPDATE = 'UPDATE',
}

export interface EntityLogChanges {
  key: string;
  path: string;
  valueType: string | null;
  value?: any;
  oldValue?: any;
  type: LogOperation;
}

export interface EntityLog {
  changes: EntityLogChanges[];
  timestamp: number;
  customerUserId: string;
}

export interface EntityLogsDocument {
  logs: EntityLog[];
}

export type NewEntityDocument<T> = T &
  EntityOwnerDocument &
  EntityTimestampsDocument &
  EntityStateDocument &
  EntityLogsDocument;

export type CreateEntityDocument<T> = Omit<
  T,
  | '_id'
  | 'createdAt'
  | 'updatedAt'
  // | 'companyId'
  | 'ownerUserId'
  | 'state'
  | 'logs'
>;
export type UpdateEntityDocument<T> = Partial<
  Omit<
    T,
    | '_id'
    | 'createdAt'
    | 'updatedAt'
    // | 'companyId'
    | 'ownerUserId'
    | 'state'
    | 'logs'
  >
>;

export type EntityDocument<T> = WithId<NewEntityDocument<T>>;
