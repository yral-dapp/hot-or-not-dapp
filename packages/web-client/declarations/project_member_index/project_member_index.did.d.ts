import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type KnownPrincipalType = { 'CanisterIdUserIndex' : null } |
  { 'CanisterIdProjectMemberIndex' : null } |
  { 'CanisterIdTopicCacheIndex' : null } |
  { 'CanisterIdRootCanister' : null } |
  { 'CanisterIdPostCache' : null } |
  { 'CanisterIdSNSController' : null } |
  { 'UserIdGlobalSuperAdmin' : null };
export interface ProjectMemberIndexInitArgs {
  'known_principal_ids' : Array<[KnownPrincipalType, Principal]>,
}
export type UserAccessRole = { 'CanisterController' : null } |
  { 'ProfileOwner' : null } |
  { 'CanisterAdmin' : null } |
  { 'ProjectCanister' : null };
export interface _SERVICE {
  'get_user_roles' : ActorMethod<[Principal], Array<UserAccessRole>>,
  'update_user_add_role' : ActorMethod<[UserAccessRole, Principal], undefined>,
  'update_user_remove_role' : ActorMethod<
    [UserAccessRole, Principal],
    undefined
  >,
}
