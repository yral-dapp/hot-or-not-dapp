import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Result = { 'Ok' : null } |
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
  'last_run_on' : SystemTime,
  'failed_canister_ids' : Array<[Principal, Principal]>,
  'successful_upgrade_count' : number,
}
export type UserAccessRole = { 'CanisterController' : null } |
  { 'ProfileOwner' : null } |
  { 'CanisterAdmin' : null } |
  { 'ProjectCanister' : null };
export interface _SERVICE {
  'delete_user_index_reset_user_canisters' : ActorMethod<[], undefined>,
  'get_index_details_is_user_name_taken' : ActorMethod<[string], boolean>,
  'get_index_details_last_upgrade_status' : ActorMethod<[], UpgradeStatus>,
  'get_user_canister_id_from_unique_user_name' : ActorMethod<
    [string],
    [] | [Principal],
  >,
  'get_user_canister_id_from_user_principal_id' : ActorMethod<
    [Principal],
    [] | [Principal],
  >,
  'get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id' : ActorMethod<
    [],
    Principal,
  >,
  'get_user_roles' : ActorMethod<[Principal], Array<UserAccessRole>>,
  'update_index_with_unique_user_name_corresponding_to_user_principal_id' : ActorMethod<
    [string, Principal],
    Result,
  >,
  'update_user_add_role' : ActorMethod<[UserAccessRole, Principal], undefined>,
  'update_user_index_upgrade_user_canisters_with_latest_wasm' : ActorMethod<
    [],
    UpgradeStatus,
  >,
  'update_user_remove_role' : ActorMethod<
    [UserAccessRole, Principal],
    undefined,
  >,
}
