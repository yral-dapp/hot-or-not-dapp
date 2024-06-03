import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AggregateStats {
  'total_number_of_not_bets' : bigint,
  'total_amount_bet' : bigint,
  'total_number_of_hot_bets' : bigint,
}
export interface BetDetails {
  'bet_direction' : BetDirection,
  'bet_maker_canister_id' : Principal,
  'amount' : bigint,
  'payout' : BetPayout,
}
export type BetDirection = { 'Hot' : null } |
  { 'Not' : null };
export type BetOnCurrentlyViewingPostError = { 'UserPrincipalNotSet' : null } |
  { 'InsufficientBalance' : null } |
  { 'UserAlreadyParticipatedInThisPost' : null } |
  { 'BettingClosed' : null } |
  { 'Unauthorized' : null } |
  { 'PostCreatorCanisterCallFailed' : null } |
  { 'UserNotLoggedIn' : null };
export type BetOutcomeForBetMaker = { 'Won' : bigint } |
  { 'Draw' : bigint } |
  { 'Lost' : null } |
  { 'AwaitingResult' : null };
export type BetPayout = { 'NotCalculatedYet' : null } |
  { 'Calculated' : bigint };
export type BettingStatus = {
    'BettingOpen' : {
      'number_of_participants' : number,
      'ongoing_room' : bigint,
      'ongoing_slot' : number,
      'has_this_user_participated_in_this_post' : [] | [boolean],
      'started_at' : SystemTime,
    }
  } |
  { 'BettingClosed' : null };
export interface FeedScore {
  'current_score' : bigint,
  'last_synchronized_at' : SystemTime,
  'last_synchronized_score' : bigint,
}
export type FollowAnotherUserProfileError = {
    'UserITriedToFollowCrossCanisterCallFailed' : null
  } |
  { 'UsersICanFollowListIsFull' : null } |
  { 'Unauthorized' : null } |
  { 'UserITriedToFollowHasTheirFollowersListFull' : null } |
  { 'Unauthenticated' : null };
export interface FollowEntryDetail {
  'canister_id' : Principal,
  'principal_id' : Principal,
}
export interface FolloweeArg {
  'followee_canister_id' : Principal,
  'followee_principal_id' : Principal,
}
export interface FollowerArg {
  'follower_canister_id' : Principal,
  'follower_principal_id' : Principal,
}
export type GetPostsOfUserProfileError = { 'ReachedEndOfItemsList' : null } |
  { 'InvalidBoundsPassed' : null } |
  { 'ExceededMaxNumberOfItemsAllowedInOneRequest' : null };
export interface HotOrNotDetails {
  'hot_or_not_feed_score' : FeedScore,
  'aggregate_stats' : AggregateStats,
  'slot_history' : Array<[number, SlotDetails]>,
}
export type HotOrNotOutcomePayoutEvent = {
    'WinningsEarnedFromBet' : {
      'slot_id' : number,
      'post_id' : bigint,
      'room_id' : bigint,
      'post_canister_id' : Principal,
      'winnings_amount' : bigint,
      'event_outcome' : BetOutcomeForBetMaker,
    }
  } |
  {
    'CommissionFromHotOrNotBet' : {
      'slot_id' : number,
      'post_id' : bigint,
      'room_pot_total_amount' : bigint,
      'room_id' : bigint,
      'post_canister_id' : Principal,
    }
  };
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
export interface IndividualUserTemplateInitArgs {
  'known_principal_ids' : [] | [Array<[KnownPrincipalType, Principal]>],
  'version' : string,
  'url_to_send_canister_metrics_to' : [] | [string],
  'profile_owner' : [] | [Principal],
  'upgrade_version_number' : [] | [bigint],
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
export type MigrationErrors = { 'InvalidToCanister' : null } |
  { 'InvalidFromCanister' : null } |
  { 'MigrationInfoNotFound' : null } |
  { 'UserNotRegistered' : null } |
  { 'Unauthorized' : null } |
  { 'TransferToCanisterCallFailed' : null } |
  { 'HotOrNotSubnetCanisterIdNotFound' : null } |
  { 'AlreadyUsedForMigration' : null } |
  { 'CanisterInfoFailed' : null } |
  { 'AlreadyMigrated' : null };
export type MigrationInfo = {
    'MigratedFromHotOrNot' : { 'account_principal' : Principal }
  } |
  { 'NotMigrated' : null } |
  { 'MigratedToYral' : { 'account_principal' : Principal } };
export type MintEvent = {
    'NewUserSignup' : { 'new_user_principal_id' : Principal }
  } |
  {
    'Referral' : {
      'referrer_user_principal_id' : Principal,
      'referee_user_principal_id' : Principal,
    }
  };
export interface PlaceBetArg {
  'bet_amount' : bigint,
  'post_id' : bigint,
  'bet_direction' : BetDirection,
  'post_canister_id' : Principal,
}
export interface PlacedBetDetail {
  'outcome_received' : BetOutcomeForBetMaker,
  'slot_id' : number,
  'post_id' : bigint,
  'room_id' : bigint,
  'canister_id' : Principal,
  'bet_direction' : BetDirection,
  'amount_bet' : bigint,
  'bet_placed_at' : SystemTime,
}
export interface Post {
  'id' : bigint,
  'is_nsfw' : boolean,
  'status' : PostStatus,
  'share_count' : bigint,
  'hashtags' : Array<string>,
  'description' : string,
  'created_at' : SystemTime,
  'likes' : Array<Principal>,
  'video_uid' : string,
  'home_feed_score' : FeedScore,
  'view_stats' : PostViewStatistics,
  'hot_or_not_details' : [] | [HotOrNotDetails],
  'creator_consent_for_inclusion_in_hot_or_not' : boolean,
}
export interface PostDetailsForFrontend {
  'id' : bigint,
  'is_nsfw' : boolean,
  'status' : PostStatus,
  'home_feed_ranking_score' : bigint,
  'hashtags' : Array<string>,
  'hot_or_not_betting_status' : [] | [BettingStatus],
  'like_count' : bigint,
  'description' : string,
  'total_view_count' : bigint,
  'created_by_display_name' : [] | [string],
  'created_at' : SystemTime,
  'created_by_unique_user_name' : [] | [string],
  'video_uid' : string,
  'created_by_user_principal_id' : Principal,
  'hot_or_not_feed_ranking_score' : [] | [bigint],
  'liked_by_me' : boolean,
  'created_by_profile_photo_url' : [] | [string],
}
export interface PostDetailsFromFrontend {
  'is_nsfw' : boolean,
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
export interface PostViewStatistics {
  'total_view_count' : bigint,
  'average_watch_percentage' : number,
  'threshold_view_count' : bigint,
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : BettingStatus } |
  { 'Err' : BetOnCurrentlyViewingPostError };
export type Result_10 = { 'Ok' : UserProfileDetailsForFrontend } |
  { 'Err' : UpdateProfileDetailsError };
export type Result_11 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : null } |
  { 'Err' : UpdateProfileSetUniqueUsernameError };
export type Result_2 = { 'Ok' : boolean } |
  { 'Err' : FollowAnotherUserProfileError };
export type Result_3 = { 'Ok' : Post } |
  { 'Err' : null };
export type Result_4 = { 'Ok' : SystemTime } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : Array<PostDetailsForFrontend> } |
  { 'Err' : GetPostsOfUserProfileError };
export type Result_6 = { 'Ok' : SessionType } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : Array<[bigint, TokenEvent]> } |
  { 'Err' : GetPostsOfUserProfileError };
export type Result_8 = { 'Ok' : null } |
  { 'Err' : MigrationErrors };
export type Result_9 = { 'Ok' : string } |
  { 'Err' : string };
export type RoomBetPossibleOutcomes = { 'HotWon' : null } |
  { 'BetOngoing' : null } |
  { 'Draw' : null } |
  { 'NotWon' : null };
export interface RoomDetails {
  'total_hot_bets' : bigint,
  'bets_made' : Array<[Principal, BetDetails]>,
  'total_not_bets' : bigint,
  'room_bets_total_pot' : bigint,
  'bet_outcome' : RoomBetPossibleOutcomes,
}
export type SessionType = { 'AnonymousSession' : null } |
  { 'RegisteredSession' : null };
export interface SlotDetails { 'room_details' : Array<[bigint, RoomDetails]> }
export type StakeEvent = { 'BetOnHotOrNotPost' : PlaceBetArg };
export interface SystemTime {
  'nanos_since_epoch' : number,
  'secs_since_epoch' : bigint,
}
export type TokenEvent = {
    'Stake' : {
      'timestamp' : SystemTime,
      'details' : StakeEvent,
      'amount' : bigint,
    }
  } |
  { 'Burn' : null } |
  {
    'Mint' : {
      'timestamp' : SystemTime,
      'details' : MintEvent,
      'amount' : bigint,
    }
  } |
  {
    'Transfer' : {
      'to_account' : Principal,
      'timestamp' : SystemTime,
      'amount' : bigint,
    }
  } |
  {
    'HotOrNotOutcomePayout' : {
      'timestamp' : SystemTime,
      'details' : HotOrNotOutcomePayoutEvent,
      'amount' : bigint,
    }
  } |
  {
    'Receive' : {
      'from_account' : Principal,
      'timestamp' : SystemTime,
      'amount' : bigint,
    }
  };
export type UpdateProfileDetailsError = { 'NotAuthorized' : null };
export type UpdateProfileSetUniqueUsernameError = {
    'UsernameAlreadyTaken' : null
  } |
  { 'UserIndexCrossCanisterCallFailed' : null } |
  { 'SendingCanisterDoesNotMatchUserCanisterId' : null } |
  { 'NotAuthorized' : null } |
  { 'UserCanisterEntryDoesNotExist' : null };
export interface UserCanisterDetails {
  'user_canister_id' : Principal,
  'profile_owner' : Principal,
}
export interface UserProfile {
  'unique_user_name' : [] | [string],
  'profile_picture_url' : [] | [string],
  'display_name' : [] | [string],
  'principal_id' : [] | [Principal],
  'profile_stats' : UserProfileGlobalStats,
  'referrer_details' : [] | [UserCanisterDetails],
}
export interface UserProfileDetailsForFrontend {
  'unique_user_name' : [] | [string],
  'lifetime_earnings' : bigint,
  'following_count' : bigint,
  'profile_picture_url' : [] | [string],
  'display_name' : [] | [string],
  'principal_id' : Principal,
  'profile_stats' : UserProfileGlobalStats,
  'followers_count' : bigint,
  'referrer_details' : [] | [UserCanisterDetails],
}
export interface UserProfileDetailsForFrontendV2 {
  'unique_user_name' : [] | [string],
  'lifetime_earnings' : bigint,
  'migration_info' : MigrationInfo,
  'following_count' : bigint,
  'profile_picture_url' : [] | [string],
  'display_name' : [] | [string],
  'principal_id' : Principal,
  'profile_stats' : UserProfileGlobalStats,
  'followers_count' : bigint,
  'referrer_details' : [] | [UserCanisterDetails],
}
export interface UserProfileGlobalStats {
  'hot_bets_received' : bigint,
  'not_bets_received' : bigint,
}
export interface UserProfileUpdateDetailsFromFrontend {
  'profile_picture_url' : [] | [string],
  'display_name' : [] | [string],
}
export interface _SERVICE {
  'add_post_v2' : ActorMethod<[PostDetailsFromFrontend], Result>,
  'backup_data_to_backup_canister' : ActorMethod<
    [Principal, Principal],
    undefined
  >,
  'bet_on_currently_viewing_post' : ActorMethod<[PlaceBetArg], Result_1>,
  'check_and_update_scores_and_share_with_post_cache_if_difference_beyond_threshold' : ActorMethod<
    [BigUint64Array | bigint[]],
    undefined
  >,
  'clear_snapshot' : ActorMethod<[], undefined>,
  'do_i_follow_this_user' : ActorMethod<[FolloweeArg], Result_2>,
  'download_snapshot' : ActorMethod<[bigint, bigint], Uint8Array | number[]>,
  'get_entire_individual_post_detail_by_id' : ActorMethod<[bigint], Result_3>,
  'get_hot_or_not_bet_details_for_this_post' : ActorMethod<
    [bigint],
    BettingStatus
  >,
  'get_hot_or_not_bets_placed_by_this_profile_with_pagination' : ActorMethod<
    [bigint],
    Array<PlacedBetDetail>
  >,
  'get_individual_hot_or_not_bet_placed_by_this_profile' : ActorMethod<
    [Principal, bigint],
    [] | [PlacedBetDetail]
  >,
  'get_individual_post_details_by_id' : ActorMethod<
    [bigint],
    PostDetailsForFrontend
  >,
  'get_last_access_time' : ActorMethod<[], Result_4>,
  'get_last_canister_functionality_access_time' : ActorMethod<[], Result_4>,
  'get_posts_of_this_user_profile_with_pagination' : ActorMethod<
    [bigint, bigint],
    Result_5
  >,
  'get_posts_of_this_user_profile_with_pagination_cursor' : ActorMethod<
    [bigint, bigint],
    Result_5
  >,
  'get_principals_that_follow_this_profile_paginated' : ActorMethod<
    [[] | [bigint]],
    Array<[bigint, FollowEntryDetail]>
  >,
  'get_principals_this_profile_follows_paginated' : ActorMethod<
    [[] | [bigint]],
    Array<[bigint, FollowEntryDetail]>
  >,
  'get_profile_details' : ActorMethod<[], UserProfileDetailsForFrontend>,
  'get_profile_details_v2' : ActorMethod<[], UserProfileDetailsForFrontendV2>,
  'get_rewarded_for_referral' : ActorMethod<[Principal, Principal], undefined>,
  'get_rewarded_for_signing_up' : ActorMethod<[], undefined>,
  'get_session_type' : ActorMethod<[], Result_6>,
  'get_stable_memory_size' : ActorMethod<[], number>,
  'get_user_caniser_cycle_balance' : ActorMethod<[], bigint>,
  'get_user_utility_token_transaction_history_with_pagination' : ActorMethod<
    [bigint, bigint],
    Result_7
  >,
  'get_utility_token_balance' : ActorMethod<[], bigint>,
  'get_version' : ActorMethod<[], string>,
  'get_version_number' : ActorMethod<[], bigint>,
  'get_well_known_principal_value' : ActorMethod<
    [KnownPrincipalType],
    [] | [Principal]
  >,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'load_snapshot' : ActorMethod<[bigint], undefined>,
  'receive_and_save_snaphot' : ActorMethod<
    [bigint, Uint8Array | number[]],
    undefined
  >,
  'receive_bet_from_bet_makers_canister' : ActorMethod<
    [PlaceBetArg, Principal],
    Result_1
  >,
  'receive_bet_winnings_when_distributed' : ActorMethod<
    [bigint, BetOutcomeForBetMaker],
    undefined
  >,
  'receive_data_from_hotornot' : ActorMethod<
    [Principal, bigint, Array<[bigint, Post]>],
    Result_8
  >,
  'receive_my_created_posts_from_data_backup_canister' : ActorMethod<
    [Array<Post>],
    undefined
  >,
  'receive_my_profile_from_data_backup_canister' : ActorMethod<
    [UserProfile],
    undefined
  >,
  'receive_my_utility_token_balance_from_data_backup_canister' : ActorMethod<
    [bigint],
    undefined
  >,
  'receive_my_utility_token_transaction_history_from_data_backup_canister' : ActorMethod<
    [Array<[bigint, TokenEvent]>],
    undefined
  >,
  'receive_principals_i_follow_from_data_backup_canister' : ActorMethod<
    [Array<Principal>],
    undefined
  >,
  'receive_principals_that_follow_me_from_data_backup_canister' : ActorMethod<
    [Array<Principal>],
    undefined
  >,
  'return_cycles_to_user_index_canister' : ActorMethod<
    [[] | [bigint]],
    undefined
  >,
  'save_snapshot_json' : ActorMethod<[], number>,
  'transfer_tokens_and_posts' : ActorMethod<[Principal, Principal], Result_8>,
  'update_last_access_time' : ActorMethod<[], Result_9>,
  'update_last_canister_functionality_access_time' : ActorMethod<[], undefined>,
  'update_post_add_view_details' : ActorMethod<
    [bigint, PostViewDetailsFromFrontend],
    undefined
  >,
  'update_post_as_ready_to_view' : ActorMethod<[bigint], undefined>,
  'update_post_increment_share_count' : ActorMethod<[bigint], bigint>,
  'update_post_toggle_like_status_by_caller' : ActorMethod<[bigint], boolean>,
  'update_profile_display_details' : ActorMethod<
    [UserProfileUpdateDetailsFromFrontend],
    Result_10
  >,
  'update_profile_owner' : ActorMethod<[[] | [Principal]], Result_11>,
  'update_profile_set_unique_username_once' : ActorMethod<[string], Result_12>,
  'update_profiles_i_follow_toggle_list_with_specified_profile' : ActorMethod<
    [FolloweeArg],
    Result_2
  >,
  'update_profiles_that_follow_me_toggle_list_with_specified_profile' : ActorMethod<
    [FollowerArg],
    Result_2
  >,
  'update_referrer_details' : ActorMethod<[UserCanisterDetails], Result_9>,
  'update_session_type' : ActorMethod<[SessionType], Result_9>,
  'update_well_known_principal' : ActorMethod<
    [KnownPrincipalType, Principal],
    undefined
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
