import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Group {
  'id' : string,
  'memberPositions' : Array<bigint>,
  'period' : GroupPeriod,
  'name' : string,
  'crypto' : GroupCrypto,
  'memberPublicKeys' : Array<string>,
  'amount' : bigint,
}
export type GroupCrypto = { 'SOL' : null } |
  { 'USDC' : null };
export type GroupPeriod = { 'monthly' : null } |
  { 'weekly' : null };
export interface _SERVICE {
  'createGroup' : ActorMethod<
    [string, string, Array<bigint>, GroupPeriod, bigint, GroupCrypto],
    { 'success' : boolean }
  >,
  'getGroup' : ActorMethod<
    [string],
    { 'content' : [] | [Group], 'success' : boolean }
  >,
  'joinGroup' : ActorMethod<[string, string], { 'success' : boolean }>,
  'listAllGroups' : ActorMethod<
    [],
    { 'contents' : Array<Group>, 'success' : boolean }
  >,
  'listGroups' : ActorMethod<
    [[] | [string], [] | [GroupPeriod], [] | [bigint], [] | [GroupCrypto]],
    { 'contents' : Array<Group>, 'success' : boolean }
  >,
  'say' : ActorMethod<[string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
