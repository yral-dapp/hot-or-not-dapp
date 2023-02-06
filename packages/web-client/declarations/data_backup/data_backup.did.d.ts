import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface BackupStatistics { 'number_of_user_entries' : bigint }
export interface DataBackupInitArgs {
  'known_principal_ids' : [] | [Array<[KnownPrincipalType, Principal]>],
  'access_control_map' : [] | [Array<[Principal, Array<UserAccessRole>]>],
}
export type KnownPrincipalType = { 'CanisterIdUserIndex' : null } |
  { 'CanisterIdConfiguration' : null } |
  { 'CanisterIdProjectMemberIndex' : null } |
  { 'CanisterIdTopicCacheIndex' : null } |
  { 'CanisterIdRootCanister' : null } |
  { 'CanisterIdDataBackup' : null } |
  { 'CanisterIdPostCache' : null } |
  { 'CanisterIdSNSController' : null } |
  { 'UserIdGlobalSuperAdmin' : null };
export type UserAccessRole = { 'CanisterController' : null } |
  { 'ProfileOwner' : null } |
  { 'CanisterAdmin' : null } |
  { 'ProjectCanister' : null };
export interface _SERVICE {
  'get_current_backup_statistics' : ActorMethod<[], BackupStatistics>,
  'get_user_roles' : ActorMethod<[Principal], Array<UserAccessRole>>,
  'get_well_known_principal_value' : ActorMethod<
    [KnownPrincipalType],
    [] | [Principal]
  >,
  'receive_unique_user_name_to_user_principal_id_mapping_from_user_index_canister' : ActorMethod<
    [Array<[string, Principal]>],
    undefined
  >,
  'receive_user_principal_id_to_canister_id_mapping_from_user_index_canister' : ActorMethod<
    [Array<[Principal, Principal]>],
    undefined
  >,
  'send_restore_data_back_to_user_index_canister' : ActorMethod<[], undefined>,
  'update_user_add_role' : ActorMethod<[UserAccessRole, Principal], undefined>,
  'update_user_remove_role' : ActorMethod<
    [UserAccessRole, Principal],
    undefined
  >,
}
