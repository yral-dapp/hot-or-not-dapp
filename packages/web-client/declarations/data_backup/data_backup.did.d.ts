import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AggregateStats {
  'total_number_of_not_bets' : bigint,
  'total_amount_bet' : bigint,
  'total_number_of_hot_bets' : bigint,
}
export interface AllUserData {
  'user_principal_id' : Principal,
  'user_canister_id' : Principal,
  'canister_data' : UserOwnedCanisterData,
}
export interface BackupStatistics { 'number_of_user_entries' : bigint }
export interface BetDetails {
  'bet_direction' : BetDirection,
  'bet_maker_canister_id' : Principal,
  'amount' : bigint,
  'payout' : BetPayout,
}
export type BetDirection = { 'Hot' : null } |
  { 'Not' : null };
export type BetPayout = { 'NotCalculatedYet' : null } |
  { 'Calculated' : bigint };
export interface DataBackupInitArgs {
  'known_principal_ids' : [] | [Array<[KnownPrincipalType, Principal]>],
  'access_control_map' : [] | [Array<[Principal, Array<UserAccessRole>]>],
}
export interface FeedScore {
  'current_score' : bigint,
  'last_synchronized_at' : SystemTime,
  'last_synchronized_score' : bigint,
}
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
      'winnings_amount' : bigint,
    }
  } |
  {
    'CommissionFromHotOrNotBet' : {
      'slot_id' : number,
      'post_id' : bigint,
      'room_pot_total_amount' : bigint,
      'room_id' : bigint,
    }
  };
export type KnownPrincipalType = { 'CanisterIdUserIndex' : null } |
  { 'CanisterIdConfiguration' : null } |
  { 'CanisterIdProjectMemberIndex' : null } |
  { 'CanisterIdTopicCacheIndex' : null } |
  { 'CanisterIdRootCanister' : null } |
  { 'CanisterIdDataBackup' : null } |
  { 'CanisterIdPostCache' : null } |
  { 'CanisterIdSNSController' : null } |
  { 'UserIdGlobalSuperAdmin' : null };
export type MintEvent = {
    'NewUserSignup' : { 'new_user_principal_id' : Principal }
  } |
  {
    'Referral' : {
      'referrer_user_principal_id' : Principal,
      'referee_user_principal_id' : Principal,
    }
  };
export interface Post {
  'id' : bigint,
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
export type PostStatus = { 'BannedForExplicitness' : null } |
  { 'BannedDueToUserReporting' : null } |
  { 'Uploaded' : null } |
  { 'CheckingExplicitness' : null } |
  { 'ReadyToView' : null } |
  { 'Transcoding' : null } |
  { 'Deleted' : null };
export interface PostViewStatistics {
  'total_view_count' : bigint,
  'average_watch_percentage' : number,
  'threshold_view_count' : bigint,
}
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
export interface SlotDetails { 'room_details' : Array<[bigint, RoomDetails]> }
export type StakeEvent = {
    'BetOnHotOrNotPost' : {
      'bet_amount' : bigint,
      'post_id' : bigint,
      'bet_direction' : BetDirection,
      'post_canister_id' : Principal,
    }
  };
export interface SystemTime {
  'nanos_since_epoch' : number,
  'secs_since_epoch' : bigint,
}
export interface TokenBalance {
  'utility_token_balance' : bigint,
  'utility_token_transaction_history' : Array<[bigint, TokenEvent]>,
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
  { 'Transfer' : null } |
  {
    'HotOrNotOutcomePayout' : {
      'timestamp' : SystemTime,
      'details' : HotOrNotOutcomePayoutEvent,
      'amount' : bigint,
    }
  };
export type UserAccessRole = { 'CanisterController' : null } |
  { 'ProfileOwner' : null } |
  { 'CanisterAdmin' : null } |
  { 'ProjectCanister' : null };
export interface UserOwnedCanisterData {
  'principals_i_follow' : Array<Principal>,
  'token_data' : TokenBalance,
  'all_created_posts' : Array<[bigint, Post]>,
  'profile' : UserProfile,
  'principals_that_follow_me' : Array<Principal>,
}
export interface UserProfile {
  'unique_user_name' : [] | [string],
  'profile_picture_url' : [] | [string],
  'display_name' : [] | [string],
  'principal_id' : [] | [Principal],
  'profile_stats' : UserProfileGlobalStats,
}
export interface UserProfileGlobalStats {
  'lifetime_earnings' : bigint,
  'hots_earned_count' : bigint,
  'nots_earned_count' : bigint,
}
export interface _SERVICE {
  'get_current_backup_statistics' : ActorMethod<[], BackupStatistics>,
  'get_individual_users_backup_data_entry' : ActorMethod<
    [Principal],
    [] | [AllUserData]
  >,
  'get_user_roles' : ActorMethod<[Principal], Array<UserAccessRole>>,
  'get_well_known_principal_value' : ActorMethod<
    [KnownPrincipalType],
    [] | [Principal]
  >,
  'receive_all_token_transactions_from_individual_user_canister' : ActorMethod<
    [Array<[bigint, TokenEvent]>, Principal],
    undefined
  >,
  'receive_all_user_posts_from_individual_user_canister' : ActorMethod<
    [Array<Post>, Principal],
    undefined
  >,
  'receive_current_token_balance_from_individual_user_canister' : ActorMethod<
    [bigint, Principal],
    undefined
  >,
  'receive_principals_i_follow_from_individual_user_canister' : ActorMethod<
    [Array<Principal>, Principal],
    undefined
  >,
  'receive_principals_that_follow_me_from_individual_user_canister' : ActorMethod<
    [Array<Principal>, Principal],
    undefined
  >,
  'receive_profile_details_from_individual_user_canister' : ActorMethod<
    [UserProfile, Principal, Principal],
    undefined
  >,
  'restore_backed_up_data_to_individual_users_canister' : ActorMethod<
    [Principal],
    string
  >,
  'send_restore_data_back_to_user_index_canister' : ActorMethod<[], undefined>,
  'update_user_add_role' : ActorMethod<[UserAccessRole, Principal], undefined>,
  'update_user_remove_role' : ActorMethod<
    [UserAccessRole, Principal],
    undefined
  >,
}
