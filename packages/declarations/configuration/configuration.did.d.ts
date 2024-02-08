import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ConfigurationInitArgs {
  'known_principal_ids' : [] | [Array<[KnownPrincipalType, Principal]>],
  'signups_enabled' : [] | [boolean],
}
export type KnownPrincipalType = { 'CanisterIdUserIndex' : null } |
  { 'CanisterIdConfiguration' : null } |
  { 'CanisterIdProjectMemberIndex' : null } |
  { 'CanisterIdTopicCacheIndex' : null } |
  { 'CanisterIdRootCanister' : null } |
  { 'CanisterIdDataBackup' : null } |
  { 'CanisterIdPostCache' : null } |
  { 'CanisterIdSNSController' : null } |
  { 'CanisterIdSnsGovernance' : null } |
  { 'UserIdGlobalSuperAdmin' : null };
export type Result = { 'Ok' : null } |
  { 'Err' : string };
export interface _SERVICE {
  'are_signups_enabled' : ActorMethod<[], boolean>,
  'get_current_list_of_all_well_known_principal_values' : ActorMethod<
    [],
    Array<[KnownPrincipalType, Principal]>
  >,
  'get_well_known_principal_value' : ActorMethod<
    [KnownPrincipalType],
    [] | [Principal]
  >,
  'toggle_signups_enabled' : ActorMethod<[], Result>,
  'update_list_of_well_known_principals' : ActorMethod<
    [KnownPrincipalType, Principal],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
