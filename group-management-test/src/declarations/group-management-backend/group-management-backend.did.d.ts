import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Group {
  'id' : string,
  'memberPositions' : Array<bigint>,
  'name' : string,
  'memberPublicKeys' : Array<string>,
}
export interface _SERVICE {
  'createGroup' : ActorMethod<
    [string, string, Array<bigint>],
    { 'success' : boolean }
  >,
  'joinGroup' : ActorMethod<[string, string], { 'success' : boolean }>,
  'listGroups' : ActorMethod<
    [],
    { 'contents' : Array<Group>, 'success' : boolean }
  >,
  'listMyGroups' : ActorMethod<
    [string],
    { 'contents' : Array<Group>, 'success' : boolean }
  >,
  'say' : ActorMethod<[string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
