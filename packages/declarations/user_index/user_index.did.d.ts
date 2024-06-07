import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BroadcastCallStatus {
  'successful_canister_ids' : Array<Principal>,
  'failed_canisters_count' : bigint,
  'successful_canisters_count' : bigint,
  'method_name' : string,
  'failed_canister_ids' : Array<[Principal, string]>,
  'timestamp' : SystemTime,
  'total_canisters' : bigint,
}
export type CanisterInstallMode = { 'reinstall' : null } |
  { 'upgrade' : null } |
  { 'install' : null };
export interface CanisterStatusResponse {
  'status' : CanisterStatusType,
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : DefiniteCanisterSettings,
  'query_stats' : QueryStats,
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
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
}
export interface HttpResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
  'status_code' : number,
}
export type KnownPrincipalType = { 'CanisterIdUserIndex' : null } |
  { 'CanisterIdPlatformOrchestrator' : null } |
  { 'CanisterIdConfiguration' : null } |
  { 'CanisterIdHotOrNotSubnetOrchestrator' : null } |
  { 'CanisterIdProjectMemberIndex' : null } |
  { 'CanisterIdTopicCacheIndex' : null } |
  { 'CanisterIdRootCanister' : null } |
  { 'CanisterIdDataBackup' : null } |
  { 'CanisterIdPostCache' : null } |
  { 'CanisterIdSNSController' : null } |
  { 'CanisterIdSnsGovernance' : null } |
  { 'UserIdGlobalSuperAdmin' : null };
export interface QueryStats {
  'response_payload_bytes_total' : bigint,
  'num_instructions_total' : bigint,
  'num_calls_total' : bigint,
  'request_payload_bytes_total' : bigint,
}
export interface RecycleStatus {
  'last_recycled_duration' : [] | [bigint],
  'last_recycled_at' : [] | [SystemTime],
  'num_last_recycled_canisters' : bigint,
  'success_canisters' : Array<string>,
  'failed_recycling' : Array<[Principal, string]>,
}
export type RejectionCode = { 'NoError' : null } |
  { 'CanisterError' : null } |
  { 'SysTransient' : null } |
  { 'DestinationInvalid' : null } |
  { 'Unknown' : null } |
  { 'SysFatal' : null } |
  { 'CanisterReject' : null };
export type Result = { 'Ok' : string } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : [CanisterStatusResponse] } |
  { 'Err' : [RejectionCode, string] };
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
  'create_pool_of_individual_user_available_canisters' : ActorMethod<
    [string, Uint8Array | number[]],
    Result
  >,
  'get_current_list_of_all_well_known_principal_values' : ActorMethod<
    [],
    Array<[KnownPrincipalType, Principal]>
  >,
  'get_index_details_is_user_name_taken' : ActorMethod<[string], boolean>,
  'get_index_details_last_upgrade_status' : ActorMethod<[], UpgradeStatus>,
  'get_last_broadcast_call_status' : ActorMethod<[], BroadcastCallStatus>,
  'get_list_of_available_canisters' : ActorMethod<[], Array<Principal>>,
  'get_recycle_status' : ActorMethod<[], RecycleStatus>,
  'get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer' : ActorMethod<
    [],
    Principal
  >,
  'get_subnet_available_capacity' : ActorMethod<[], bigint>,
  'get_subnet_backup_capacity' : ActorMethod<[], bigint>,
  'get_user_canister_id_from_unique_user_name' : ActorMethod<
    [string],
    [] | [Principal]
  >,
  'get_user_canister_id_from_user_principal_id' : ActorMethod<
    [Principal],
    [] | [Principal]
  >,
  'get_user_canister_incl_avail_list' : ActorMethod<[], Array<Principal>>,
  'get_user_canister_list' : ActorMethod<[], Array<Principal>>,
  'get_user_canister_status' : ActorMethod<[Principal], Result_1>,
  'get_user_id_and_canister_list' : ActorMethod<
    [],
    Array<[Principal, Principal]>
  >,
  'get_user_index_canister_count' : ActorMethod<[], bigint>,
  'get_user_index_canister_cycle_balance' : ActorMethod<[], bigint>,
  'get_well_known_principal_value' : ActorMethod<
    [KnownPrincipalType],
    [] | [Principal]
  >,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'issue_rewards_for_referral' : ActorMethod<
    [Principal, Principal, Principal],
    Result
  >,
  'receive_data_from_backup_canister_and_restore_data_to_heap' : ActorMethod<
    [Principal, Principal, string],
    undefined
  >,
  'reclaim_cycles_from_individual_canisters' : ActorMethod<[], undefined>,
  'reset_user_individual_canisters' : ActorMethod<[Array<Principal>], Result>,
  'return_cycles_to_platform_orchestrator_canister' : ActorMethod<[], Result>,
  'set_permission_to_upgrade_individual_canisters' : ActorMethod<
    [boolean],
    string
  >,
  'start_upgrades_for_individual_canisters' : ActorMethod<
    [string, Uint8Array | number[]],
    string
  >,
  'toggle_signups_enabled' : ActorMethod<[], Result_2>,
  'update_canisters_last_functionality_access_time' : ActorMethod<[], string>,
  'update_index_with_unique_user_name_corresponding_to_user_principal_id' : ActorMethod<
    [string, Principal],
    Result_3
  >,
  'update_profile_owner_for_individual_canisters' : ActorMethod<[], undefined>,
  'update_well_known_principal' : ActorMethod<
    [KnownPrincipalType, Principal],
    undefined
  >,
  'upgrade_specific_individual_user_canister_with_latest_wasm' : ActorMethod<
    [Principal, [] | [Principal], [] | [CanisterInstallMode]],
    string
  >,
  'validate_reset_user_individual_canisters' : ActorMethod<
    [Array<Principal>],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
