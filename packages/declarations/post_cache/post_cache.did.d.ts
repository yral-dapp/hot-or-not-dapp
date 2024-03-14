import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

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
  { 'CanisterIdProjectMemberIndex' : null } |
  { 'CanisterIdTopicCacheIndex' : null } |
  { 'CanisterIdRootCanister' : null } |
  { 'CanisterIdDataBackup' : null } |
  { 'CanisterIdPostCache' : null } |
  { 'CanisterIdSNSController' : null } |
  { 'CanisterIdSnsGovernance' : null } |
  { 'UserIdGlobalSuperAdmin' : null };
export type NsfwFilter = { 'IncludeNsfw' : null } |
  { 'OnlyNsfw' : null } |
  { 'ExcludeNsfw' : null };
export interface PostCacheInitArgs {
  'known_principal_ids' : [] | [Array<[KnownPrincipalType, Principal]>],
  'version' : string,
  'upgrade_version_number' : [] | [bigint],
}
export interface PostScoreIndexItemV1 {
  'is_nsfw' : boolean,
  'status' : PostStatus,
  'post_id' : bigint,
  'created_at' : [] | [SystemTime],
  'score' : bigint,
  'publisher_canister_id' : Principal,
}
export type PostStatus = { 'BannedForExplicitness' : null } |
  { 'BannedDueToUserReporting' : null } |
  { 'Uploaded' : null } |
  { 'CheckingExplicitness' : null } |
  { 'ReadyToView' : null } |
  { 'Transcoding' : null } |
  { 'Deleted' : null };
export type Result = { 'Ok' : Array<PostScoreIndexItemV1> } |
  { 'Err' : TopPostsFetchError };
export interface SystemTime {
  'nanos_since_epoch' : number,
  'secs_since_epoch' : bigint,
}
export type TopPostsFetchError = { 'ReachedEndOfItemsList' : null } |
  { 'InvalidBoundsPassed' : null } |
  { 'ExceededMaxNumberOfItemsAllowedInOneRequest' : null };
export interface _SERVICE {
  'get_cycle_balance' : ActorMethod<[], bigint>,
  'get_top_posts_aggregated_from_canisters_on_this_network_for_home_feed_cursor' : ActorMethod<
    [bigint, bigint, [] | [boolean], [] | [PostStatus], [] | [NsfwFilter]],
    Result
  >,
  'get_top_posts_aggregated_from_canisters_on_this_network_for_hot_or_not_feed_cursor' : ActorMethod<
    [bigint, bigint, [] | [boolean], [] | [PostStatus], [] | [NsfwFilter]],
    Result
  >,
  'get_well_known_principal_value' : ActorMethod<
    [KnownPrincipalType],
    [] | [Principal]
  >,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'receive_top_home_feed_posts_from_publishing_canister' : ActorMethod<
    [Array<PostScoreIndexItemV1>],
    undefined
  >,
  'receive_top_hot_or_not_feed_posts_from_publishing_canister' : ActorMethod<
    [Array<PostScoreIndexItemV1>],
    undefined
  >,
  'remove_all_feed_entries' : ActorMethod<[], undefined>,
  'update_post_home_feed' : ActorMethod<[PostScoreIndexItemV1], undefined>,
  'update_post_hot_or_not_feed' : ActorMethod<
    [PostScoreIndexItemV1],
    undefined
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
