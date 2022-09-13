import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type UserAccessRole = { 'CanisterController' : null } |
  { 'ProfileOwner' : null } |
  { 'CanisterAdmin' : null };
export interface _SERVICE {
  'delete_user_index_reset_user_canisters' : ActorMethod<[], undefined>,
  'get_user_canister_id_from_user_principal_id' : ActorMethod<[], Principal>,
  'get_user_roles' : ActorMethod<[Principal], Array<UserAccessRole>>,
  'update_user_add_role' : ActorMethod<[UserAccessRole, Principal], undefined>,
  'update_user_remove_role' : ActorMethod<
    [UserAccessRole, Principal],
    undefined,
  >,
}
