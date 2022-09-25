import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface PostScoreIndexItem {
  'post_id' : bigint,
  'score' : bigint,
  'publisher_canister_id' : Principal,
}
export type Result = { 'Ok' : Array<PostScoreIndexItem> } |
  { 'Err' : TopPostsFetchError };
export type TopPostsFetchError = { 'ReachedEndOfItemsList' : null } |
  { 'InvalidBoundsPassed' : null } |
  { 'ExceededMaxNumberOfItemsAllowedInOneRequest' : null };
export type UserAccessRole = { 'CanisterController' : null } |
  { 'ProfileOwner' : null } |
  { 'CanisterAdmin' : null } |
  { 'ProjectCanister' : null };
export interface _SERVICE {
  'get_top_posts_aggregated_from_canisters_on_this_network' : ActorMethod<
    [bigint, bigint],
    Result,
  >,
  'get_user_roles' : ActorMethod<[Principal], Array<UserAccessRole>>,
  'receive_top_posts_from_publishing_canister' : ActorMethod<
    [Array<PostScoreIndexItem>],
    undefined,
  >,
  'update_user_add_role' : ActorMethod<[UserAccessRole, Principal], undefined>,
  'update_user_remove_role' : ActorMethod<
    [UserAccessRole, Principal],
    undefined,
  >,
}
