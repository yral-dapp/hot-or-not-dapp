import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type CanisterInstallMode = { 'reinstall' : null } |
  { 'upgrade' : null } |
  { 'install' : null };
export interface CanisterStatusResponse {
  'status' : CanisterStatusType,
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : DefiniteCanisterSettings,
  'idle_cycles_burned_per_day' : bigint,
  'module_hash' : [] | [Uint8Array | number[]],
}
export type CanisterStatusType = { 'stopped' : null } |
  { 'stopping' : null } |
  { 'running' : null };
export interface DefiniteCanisterSettings {
  'freezing_threshold' : bigint,
  'controllers' : Array<Principal>,
  'memory_allocation' : bigint,
  'compute_allocation' : bigint,
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
export type RejectionCode = { 'NoError' : null } |
  { 'CanisterError' : null } |
  { 'SysTransient' : null } |
  { 'DestinationInvalid' : null } |
  { 'Unknown' : null } |
  { 'SysFatal' : null } |
  { 'CanisterReject' : null };
export type Result = { 'Ok' : [CanisterStatusResponse] } |
  { 'Err' : [RejectionCode, string] };
export type Result_1 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : null } |
  { 'Err' : SetUniqueUsernameError };
export type SetUniqueUsernameError = { 'UsernameAlreadyTaken' : null } |
  { 'SendingCanisterDoesNotMatchUserCanisterId' : null } |
  { 'UserCanisterEntryDoesNotExist' : null };
export interface SystemTime {
  'nanos_since_epoch' : number,
  'secs_since_epoch' : bigint,
}
export interface UpgradeStatus {
  'version_number' : bigint,
  'version' : string,
  'last_run_on' : SystemTime,
  'failed_canister_ids' : Array<[Principal, Principal, string]>,
  'successful_upgrade_count' : number,
}
export type UserAccessRole = { 'CanisterController' : null } |
  { 'ProfileOwner' : null } |
  { 'CanisterAdmin' : null } |
  { 'ProjectCanister' : null };
export interface UserIndexInitArgs {
  'known_principal_ids' : [] | [Array<[KnownPrincipalType, Principal]>],
  'version' : string,
  'access_control_map' : [] | [Array<[Principal, Array<UserAccessRole>]>],
}
export interface _SERVICE {
  'are_signups_enabled' : ActorMethod<[], boolean>,
  'backup_all_individual_user_canisters' : ActorMethod<[], undefined>,
  'get_current_list_of_all_well_known_principal_values' : ActorMethod<
    [],
    Array<[KnownPrincipalType, Principal]>
  >,
  'get_index_details_is_user_name_taken' : ActorMethod<[string], boolean>,
  'get_index_details_last_upgrade_status' : ActorMethod<[], UpgradeStatus>,
  'get_list_of_available_canisters' : ActorMethod<[], Array<Principal>>,
  'get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer' : ActorMethod<
    [[] | [Principal]],
    Principal
  >,
  'get_user_canister_id_from_unique_user_name' : ActorMethod<
    [string],
    [] | [Principal]
  >,
  'get_user_canister_id_from_user_principal_id' : ActorMethod<
    [Principal],
    [] | [Principal]
  >,
  'get_user_canister_status' : ActorMethod<[Principal], Result>,
  'get_user_index_canister_count' : ActorMethod<[], bigint>,
  'get_user_index_canister_cycle_balance' : ActorMethod<[], bigint>,
  'get_well_known_principal_value' : ActorMethod<
    [KnownPrincipalType],
    [] | [Principal]
  >,
  'receive_data_from_backup_canister_and_restore_data_to_heap' : ActorMethod<
    [Principal, Principal, string],
    undefined
  >,
  'reset_user_individual_canisters' : ActorMethod<[Array<Principal>], Result_1>,
  'set_permission_to_upgrade_individual_canisters' : ActorMethod<
    [boolean],
    string
  >,
  'start_upgrades_for_individual_canisters' : ActorMethod<[], string>,
  'toggle_signups_enabled' : ActorMethod<[], Result_2>,
  'update_index_with_unique_user_name_corresponding_to_user_principal_id' : ActorMethod<
    [string, Principal],
    Result_3
  >,
  'upgrade_specific_individual_user_canister_with_latest_wasm' : ActorMethod<
    [Principal, Principal, [] | [CanisterInstallMode]],
    string
  >,
  'validate_reset_user_individual_canisters' : ActorMethod<
    [Array<Principal>],
    Result_1
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
