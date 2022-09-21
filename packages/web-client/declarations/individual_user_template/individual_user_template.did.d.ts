import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface PostDetailsForFrontend {
  'id' : bigint,
  'status' : PostStatus,
  'hashtags' : Array<string>,
  'like_count' : bigint,
  'description' : string,
  'total_view_count' : bigint,
  'video_url' : string,
  'created_by_username' : [] | [string],
  'liked_by_me' : boolean,
  'created_by_profile_photo_url' : [] | [string],
}
export interface PostDetailsFromFrontend {
  'hashtags' : Array<string>,
  'description' : string,
  'video_uid' : string,
  'creator_consent_for_inclusion_in_hot_or_not' : boolean,
}
export type PostStatus = { 'BannedForExplicitness' : null } |
  { 'BannedDueToUserReporting' : null } |
  { 'Uploaded' : null } |
  { 'CheckingExplicitness' : null } |
  { 'ReadyToView' : null } |
  { 'Transcoding' : null } |
  { 'Deleted' : null };
export type PostViewDetailsFromFrontend = {
    'WatchedMultipleTimes' : {
      'percentage_watched' : number,
      'watch_count' : number,
    }
  } |
  { 'WatchedPartially' : { 'percentage_watched' : number } };
export type Result = { 'Ok' : UserProfileDetailsForFrontend } |
  { 'Err' : UpdateProfileDetailsError };
export type UpdateProfileDetailsError = { 'NotAuthorized' : null };
export type UserAccessRole = { 'CanisterController' : null } |
  { 'ProfileOwner' : null } |
  { 'CanisterAdmin' : null } |
  { 'ProjectCanister' : null };
export interface UserProfile {
  'unique_user_name' : [] | [string],
  'profile_picture_url' : [] | [string],
  'display_name' : [] | [string],
  'principal_id' : Principal,
  'followers' : Array<Principal>,
  'following' : Array<Principal>,
  'profile_stats' : UserProfileGlobalStats,
}
export interface UserProfileDetailsForFrontend {
  'unique_user_name' : [] | [string],
  'profile_picture_url' : [] | [string],
  'display_name' : [] | [string],
  'principal_id' : Principal,
}
export interface UserProfileDetailsFromFrontend {
  'unique_user_name' : [] | [string],
  'profile_picture_url' : [] | [string],
  'display_name' : [] | [string],
}
export interface UserProfileGlobalStats {
  'lifetime_earnings' : bigint,
  'hots_earned_count' : bigint,
  'nots_earned_count' : bigint,
}
export interface _SERVICE {
  'add_post' : ActorMethod<[PostDetailsFromFrontend], bigint>,
  'get_individual_post_details_by_id' : ActorMethod<
    [bigint],
    PostDetailsForFrontend,
  >,
  'get_posts_of_this_user_profile_with_pagination' : ActorMethod<
    [bigint, bigint],
    Array<PostDetailsForFrontend>,
  >,
  'get_profile_details' : ActorMethod<[], UserProfile>,
  'get_user_roles' : ActorMethod<[Principal], Array<UserAccessRole>>,
  'update_post_add_view_details' : ActorMethod<
    [bigint, PostViewDetailsFromFrontend],
    undefined,
  >,
  'update_post_as_ready_to_view' : ActorMethod<[bigint], undefined>,
  'update_post_increment_share_count' : ActorMethod<[bigint], bigint>,
  'update_post_toggle_like_status_by_caller' : ActorMethod<[bigint], boolean>,
  'update_profile_details' : ActorMethod<
    [UserProfileDetailsFromFrontend],
    Result,
  >,
  'update_profile_toggle_follower_list_of_followee_by_calling_principal' : ActorMethod<
    [],
    boolean,
  >,
  'update_profile_toggle_following_list_of_follower_by_user_to_follow' : ActorMethod<
    [Principal],
    boolean,
  >,
  'update_user_add_role' : ActorMethod<[UserAccessRole, Principal], undefined>,
  'update_user_remove_role' : ActorMethod<
    [UserAccessRole, Principal],
    undefined,
  >,
}
