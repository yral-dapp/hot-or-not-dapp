export const idlFactory = ({ IDL }) => {
  const KnownPrincipalType = IDL.Variant({
    'CanisterIdUserIndex' : IDL.Null,
    'CanisterIdConfiguration' : IDL.Null,
    'CanisterIdProjectMemberIndex' : IDL.Null,
    'CanisterIdTopicCacheIndex' : IDL.Null,
    'CanisterIdRootCanister' : IDL.Null,
    'CanisterIdDataBackup' : IDL.Null,
    'CanisterIdPostCache' : IDL.Null,
    'CanisterIdSNSController' : IDL.Null,
    'UserIdGlobalSuperAdmin' : IDL.Null,
  });
  const IndividualUserTemplateInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
    'profile_owner' : IDL.Opt(IDL.Principal),
    'upgrade_version_number' : IDL.Opt(IDL.Nat64),
  });
  const PostDetailsFromFrontend = IDL.Record({
    'hashtags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'video_uid' : IDL.Text,
    'creator_consent_for_inclusion_in_hot_or_not' : IDL.Bool,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
  const BetDirection = IDL.Variant({ 'Hot' : IDL.Null, 'Not' : IDL.Null });
  const PlaceBetArg = IDL.Record({
    'bet_amount' : IDL.Nat64,
    'post_id' : IDL.Nat64,
    'bet_direction' : BetDirection,
    'post_canister_id' : IDL.Principal,
  });
  const SystemTime = IDL.Record({
    'nanos_since_epoch' : IDL.Nat32,
    'secs_since_epoch' : IDL.Nat64,
  });
  const BettingStatus = IDL.Variant({
    'BettingOpen' : IDL.Record({
      'number_of_participants' : IDL.Nat8,
      'ongoing_room' : IDL.Nat64,
      'ongoing_slot' : IDL.Nat8,
      'has_this_user_participated_in_this_post' : IDL.Opt(IDL.Bool),
      'started_at' : SystemTime,
    }),
    'BettingClosed' : IDL.Null,
  });
  const BetOnCurrentlyViewingPostError = IDL.Variant({
    'UserPrincipalNotSet' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'UserAlreadyParticipatedInThisPost' : IDL.Null,
    'BettingClosed' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'PostCreatorCanisterCallFailed' : IDL.Null,
    'UserNotLoggedIn' : IDL.Null,
  });
  const Result_1 = IDL.Variant({
    'Ok' : BettingStatus,
    'Err' : BetOnCurrentlyViewingPostError,
  });
  const PostStatus = IDL.Variant({
    'BannedForExplicitness' : IDL.Null,
    'BannedDueToUserReporting' : IDL.Null,
    'Uploaded' : IDL.Null,
    'CheckingExplicitness' : IDL.Null,
    'ReadyToView' : IDL.Null,
    'Transcoding' : IDL.Null,
    'Deleted' : IDL.Null,
  });
  const FeedScore = IDL.Record({
    'current_score' : IDL.Nat64,
    'last_synchronized_at' : SystemTime,
    'last_synchronized_score' : IDL.Nat64,
  });
  const PostViewStatistics = IDL.Record({
    'total_view_count' : IDL.Nat64,
    'average_watch_percentage' : IDL.Nat8,
    'threshold_view_count' : IDL.Nat64,
  });
  const AggregateStats = IDL.Record({
    'total_number_of_not_bets' : IDL.Nat64,
    'total_amount_bet' : IDL.Nat64,
    'total_number_of_hot_bets' : IDL.Nat64,
  });
  const BetDetails = IDL.Record({
    'bet_direction' : BetDirection,
    'amount' : IDL.Nat64,
  });
  const RoomBetPossibleOutcomes = IDL.Variant({
    'HotWon' : IDL.Null,
    'BetOngoing' : IDL.Null,
    'Draw' : IDL.Null,
    'NotWon' : IDL.Null,
  });
  const RoomDetails = IDL.Record({
    'bets_made' : IDL.Vec(IDL.Tuple(IDL.Principal, BetDetails)),
    'bet_outcome' : RoomBetPossibleOutcomes,
  });
  const SlotDetails = IDL.Record({
    'room_details' : IDL.Vec(IDL.Tuple(IDL.Nat64, RoomDetails)),
  });
  const HotOrNotDetails = IDL.Record({
    'hot_or_not_feed_score' : FeedScore,
    'aggregate_stats' : AggregateStats,
    'slot_history' : IDL.Vec(IDL.Tuple(IDL.Nat8, SlotDetails)),
  });
  const Post = IDL.Record({
    'id' : IDL.Nat64,
    'status' : PostStatus,
    'share_count' : IDL.Nat64,
    'hashtags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'created_at' : SystemTime,
    'likes' : IDL.Vec(IDL.Principal),
    'video_uid' : IDL.Text,
    'home_feed_score' : FeedScore,
    'view_stats' : PostViewStatistics,
    'hot_or_not_details' : IDL.Opt(HotOrNotDetails),
    'creator_consent_for_inclusion_in_hot_or_not' : IDL.Bool,
  });
  const Result_2 = IDL.Variant({ 'Ok' : Post, 'Err' : IDL.Null });
  const PostDetailsForFrontend = IDL.Record({
    'id' : IDL.Nat64,
    'status' : PostStatus,
    'home_feed_ranking_score' : IDL.Nat64,
    'hashtags' : IDL.Vec(IDL.Text),
    'hot_or_not_betting_status' : IDL.Opt(BettingStatus),
    'like_count' : IDL.Nat64,
    'description' : IDL.Text,
    'total_view_count' : IDL.Nat64,
    'created_by_display_name' : IDL.Opt(IDL.Text),
    'created_at' : SystemTime,
    'created_by_unique_user_name' : IDL.Opt(IDL.Text),
    'video_uid' : IDL.Text,
    'created_by_user_principal_id' : IDL.Principal,
    'hot_or_not_feed_ranking_score' : IDL.Opt(IDL.Nat64),
    'liked_by_me' : IDL.Bool,
    'created_by_profile_photo_url' : IDL.Opt(IDL.Text),
  });
  const GetPostsOfUserProfileError = IDL.Variant({
    'ReachedEndOfItemsList' : IDL.Null,
    'InvalidBoundsPassed' : IDL.Null,
    'ExceededMaxNumberOfItemsAllowedInOneRequest' : IDL.Null,
  });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Vec(PostDetailsForFrontend),
    'Err' : GetPostsOfUserProfileError,
  });
  const Result_4 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Principal),
    'Err' : GetPostsOfUserProfileError,
  });
  const UserProfileGlobalStats = IDL.Record({
    'lifetime_earnings' : IDL.Nat64,
    'hots_earned_count' : IDL.Nat64,
    'nots_earned_count' : IDL.Nat64,
  });
  const UserProfileDetailsForFrontend = IDL.Record({
    'unique_user_name' : IDL.Opt(IDL.Text),
    'following_count' : IDL.Nat64,
    'profile_picture_url' : IDL.Opt(IDL.Text),
    'display_name' : IDL.Opt(IDL.Text),
    'principal_id' : IDL.Principal,
    'profile_stats' : UserProfileGlobalStats,
    'followers_count' : IDL.Nat64,
  });
  const MintEvent = IDL.Variant({
    'NewUserSignup' : IDL.Record({ 'new_user_principal_id' : IDL.Principal }),
    'Referral' : IDL.Record({
      'referrer_user_principal_id' : IDL.Principal,
      'referee_user_principal_id' : IDL.Principal,
    }),
  });
  const TokenEvent = IDL.Variant({
    'Stake' : IDL.Null,
    'Burn' : IDL.Null,
    'Mint' : IDL.Record({ 'timestamp' : SystemTime, 'details' : MintEvent }),
    'Transfer' : IDL.Null,
  });
  const Result_5 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, TokenEvent)),
    'Err' : GetPostsOfUserProfileError,
  });
  const UserProfile = IDL.Record({
    'unique_user_name' : IDL.Opt(IDL.Text),
    'profile_picture_url' : IDL.Opt(IDL.Text),
    'display_name' : IDL.Opt(IDL.Text),
    'principal_id' : IDL.Opt(IDL.Principal),
    'profile_stats' : UserProfileGlobalStats,
  });
  const PostViewDetailsFromFrontend = IDL.Variant({
    'WatchedMultipleTimes' : IDL.Record({
      'percentage_watched' : IDL.Nat8,
      'watch_count' : IDL.Nat8,
    }),
    'WatchedPartially' : IDL.Record({ 'percentage_watched' : IDL.Nat8 }),
  });
  const FollowAnotherUserProfileError = IDL.Variant({
    'UserToFollowDoesNotExist' : IDL.Null,
    'UserIndexCrossCanisterCallFailed' : IDL.Null,
    'UserITriedToFollowCrossCanisterCallFailed' : IDL.Null,
    'UsersICanFollowListIsFull' : IDL.Null,
    'MyCanisterIDDoesNotMatchMyPrincipalCanisterIDMappingSeenByUserITriedToFollow' : IDL.Null,
    'UserITriedToFollowDidNotFindMe' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'UserITriedToFollowHasTheirFollowersListFull' : IDL.Null,
  });
  const Result_6 = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : FollowAnotherUserProfileError,
  });
  const AnotherUserFollowedMeError = IDL.Variant({
    'UserIndexCrossCanisterCallFailed' : IDL.Null,
    'FollowersListFull' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'UserTryingToFollowMeDoesNotExist' : IDL.Null,
  });
  const Result_7 = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : AnotherUserFollowedMeError,
  });
  const UserProfileUpdateDetailsFromFrontend = IDL.Record({
    'profile_picture_url' : IDL.Opt(IDL.Text),
    'display_name' : IDL.Opt(IDL.Text),
  });
  const UpdateProfileDetailsError = IDL.Variant({ 'NotAuthorized' : IDL.Null });
  const Result_8 = IDL.Variant({
    'Ok' : UserProfileDetailsForFrontend,
    'Err' : UpdateProfileDetailsError,
  });
  const UpdateProfileSetUniqueUsernameError = IDL.Variant({
    'UsernameAlreadyTaken' : IDL.Null,
    'UserIndexCrossCanisterCallFailed' : IDL.Null,
    'SendingCanisterDoesNotMatchUserCanisterId' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'UserCanisterEntryDoesNotExist' : IDL.Null,
  });
  const Result_9 = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : UpdateProfileSetUniqueUsernameError,
  });
  return IDL.Service({
    'add_post_v2' : IDL.Func([PostDetailsFromFrontend], [Result], []),
    'backup_data_to_backup_canister' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [],
        [],
      ),
    'bet_on_currently_viewing_post' : IDL.Func([PlaceBetArg], [Result_1], []),
    'get_entire_individual_post_detail_by_id' : IDL.Func(
        [IDL.Nat64],
        [Result_2],
        ['query'],
      ),
    'get_following_status_do_i_follow_this_user' : IDL.Func(
        [IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'get_hot_or_not_bet_details_for_this_post' : IDL.Func(
        [IDL.Nat64],
        [BettingStatus],
        ['query'],
      ),
    'get_individual_post_details_by_id' : IDL.Func(
        [IDL.Nat64],
        [PostDetailsForFrontend],
        ['query'],
      ),
    'get_posts_of_this_user_profile_with_pagination' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_3],
        ['query'],
      ),
    'get_principals_i_follow_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_4],
        ['query'],
      ),
    'get_principals_that_follow_me_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_4],
        ['query'],
      ),
    'get_profile_details' : IDL.Func(
        [],
        [UserProfileDetailsForFrontend],
        ['query'],
      ),
    'get_rewarded_for_referral' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [],
        [],
      ),
    'get_rewarded_for_signing_up' : IDL.Func([], [], []),
    'get_user_utility_token_transaction_history_with_pagination' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_5],
        ['query'],
      ),
    'get_utility_token_balance' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_well_known_principal_value' : IDL.Func(
        [KnownPrincipalType],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'receive_bet_from_bet_makers_canister' : IDL.Func(
        [PlaceBetArg, IDL.Principal],
        [Result_1],
        [],
      ),
    'receive_my_created_posts_from_data_backup_canister' : IDL.Func(
        [IDL.Vec(Post)],
        [],
        [],
      ),
    'receive_my_profile_from_data_backup_canister' : IDL.Func(
        [UserProfile],
        [],
        [],
      ),
    'receive_my_utility_token_balance_from_data_backup_canister' : IDL.Func(
        [IDL.Nat64],
        [],
        [],
      ),
    'receive_my_utility_token_transaction_history_from_data_backup_canister' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Nat64, TokenEvent))],
        [],
        [],
      ),
    'receive_principals_i_follow_from_data_backup_canister' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [],
        [],
      ),
    'receive_principals_that_follow_me_from_data_backup_canister' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [],
        [],
      ),
    'return_cycles_to_user_index_canister' : IDL.Func([], [], []),
    'update_post_add_view_details' : IDL.Func(
        [IDL.Nat64, PostViewDetailsFromFrontend],
        [],
        [],
      ),
    'update_post_as_ready_to_view' : IDL.Func([IDL.Nat64], [], []),
    'update_post_increment_share_count' : IDL.Func(
        [IDL.Nat64],
        [IDL.Nat64],
        [],
      ),
    'update_post_toggle_like_status_by_caller' : IDL.Func(
        [IDL.Nat64],
        [IDL.Bool],
        [],
      ),
    'update_principals_i_follow_toggle_list_with_principal_specified' : IDL.Func(
        [IDL.Principal],
        [Result_6],
        [],
      ),
    'update_principals_that_follow_me_toggle_list_with_specified_principal' : IDL.Func(
        [IDL.Principal],
        [Result_7],
        [],
      ),
    'update_profile_display_details' : IDL.Func(
        [UserProfileUpdateDetailsFromFrontend],
        [Result_8],
        [],
      ),
    'update_profile_set_unique_username_once' : IDL.Func(
        [IDL.Text],
        [Result_9],
        [],
      ),
  });
};
export const init = ({ IDL }) => {
  const KnownPrincipalType = IDL.Variant({
    'CanisterIdUserIndex' : IDL.Null,
    'CanisterIdConfiguration' : IDL.Null,
    'CanisterIdProjectMemberIndex' : IDL.Null,
    'CanisterIdTopicCacheIndex' : IDL.Null,
    'CanisterIdRootCanister' : IDL.Null,
    'CanisterIdDataBackup' : IDL.Null,
    'CanisterIdPostCache' : IDL.Null,
    'CanisterIdSNSController' : IDL.Null,
    'UserIdGlobalSuperAdmin' : IDL.Null,
  });
  const IndividualUserTemplateInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
    'profile_owner' : IDL.Opt(IDL.Principal),
    'upgrade_version_number' : IDL.Opt(IDL.Nat64),
  });
  return [IndividualUserTemplateInitArgs];
};
