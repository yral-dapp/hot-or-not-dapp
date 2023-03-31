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
  const UserAccessRole = IDL.Variant({
    'CanisterController' : IDL.Null,
    'ProfileOwner' : IDL.Null,
    'CanisterAdmin' : IDL.Null,
    'ProjectCanister' : IDL.Null,
  });
  const DataBackupInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
    'access_control_map' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(UserAccessRole)))
    ),
  });
  const BackupStatistics = IDL.Record({ 'number_of_user_entries' : IDL.Nat64 });
  const SystemTime = IDL.Record({
    'nanos_since_epoch' : IDL.Nat32,
    'secs_since_epoch' : IDL.Nat64,
  });
  const BetDirection = IDL.Variant({ 'Hot' : IDL.Null, 'Not' : IDL.Null });
  const StakeEvent = IDL.Variant({
    'BetOnHotOrNotPost' : IDL.Record({
      'bet_amount' : IDL.Nat64,
      'post_id' : IDL.Nat64,
      'bet_direction' : BetDirection,
      'post_canister_id' : IDL.Principal,
    }),
  });
  const MintEvent = IDL.Variant({
    'NewUserSignup' : IDL.Record({ 'new_user_principal_id' : IDL.Principal }),
    'Referral' : IDL.Record({
      'referrer_user_principal_id' : IDL.Principal,
      'referee_user_principal_id' : IDL.Principal,
    }),
  });
  const HotOrNotOutcomePayoutEvent = IDL.Variant({
    'WinningsEarnedFromBet' : IDL.Record({
      'slot_id' : IDL.Nat8,
      'post_id' : IDL.Nat64,
      'room_id' : IDL.Nat64,
      'winnings_amount' : IDL.Nat64,
    }),
    'CommissionFromHotOrNotBet' : IDL.Record({
      'slot_id' : IDL.Nat8,
      'post_id' : IDL.Nat64,
      'room_pot_total_amount' : IDL.Nat64,
      'room_id' : IDL.Nat64,
    }),
  });
  const TokenEvent = IDL.Variant({
    'Stake' : IDL.Record({
      'timestamp' : SystemTime,
      'details' : StakeEvent,
      'amount' : IDL.Nat64,
    }),
    'Burn' : IDL.Null,
    'Mint' : IDL.Record({
      'timestamp' : SystemTime,
      'details' : MintEvent,
      'amount' : IDL.Nat64,
    }),
    'Transfer' : IDL.Null,
    'HotOrNotOutcomePayout' : IDL.Record({
      'timestamp' : SystemTime,
      'details' : HotOrNotOutcomePayoutEvent,
      'amount' : IDL.Nat64,
    }),
  });
  const TokenBalance = IDL.Record({
    'utility_token_balance' : IDL.Nat64,
    'utility_token_transaction_history' : IDL.Vec(
      IDL.Tuple(IDL.Nat64, TokenEvent)
    ),
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
  const BetPayout = IDL.Variant({
    'NotCalculatedYet' : IDL.Null,
    'Calculated' : IDL.Nat64,
  });
  const BetDetails = IDL.Record({
    'bet_direction' : BetDirection,
    'bet_maker_canister_id' : IDL.Principal,
    'amount' : IDL.Nat64,
    'payout' : BetPayout,
  });
  const RoomBetPossibleOutcomes = IDL.Variant({
    'HotWon' : IDL.Null,
    'BetOngoing' : IDL.Null,
    'Draw' : IDL.Null,
    'NotWon' : IDL.Null,
  });
  const RoomDetails = IDL.Record({
    'total_hot_bets' : IDL.Nat64,
    'bets_made' : IDL.Vec(IDL.Tuple(IDL.Principal, BetDetails)),
    'total_not_bets' : IDL.Nat64,
    'room_bets_total_pot' : IDL.Nat64,
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
  const UserProfileGlobalStats = IDL.Record({
    'lifetime_earnings' : IDL.Nat64,
    'hots_earned_count' : IDL.Nat64,
    'nots_earned_count' : IDL.Nat64,
  });
  const UserProfile = IDL.Record({
    'unique_user_name' : IDL.Opt(IDL.Text),
    'profile_picture_url' : IDL.Opt(IDL.Text),
    'display_name' : IDL.Opt(IDL.Text),
    'principal_id' : IDL.Opt(IDL.Principal),
    'profile_stats' : UserProfileGlobalStats,
  });
  const UserOwnedCanisterData = IDL.Record({
    'principals_i_follow' : IDL.Vec(IDL.Principal),
    'token_data' : TokenBalance,
    'all_created_posts' : IDL.Vec(IDL.Tuple(IDL.Nat64, Post)),
    'profile' : UserProfile,
    'principals_that_follow_me' : IDL.Vec(IDL.Principal),
  });
  const AllUserData = IDL.Record({
    'user_principal_id' : IDL.Principal,
    'user_canister_id' : IDL.Principal,
    'canister_data' : UserOwnedCanisterData,
  });
  return IDL.Service({
    'get_current_backup_statistics' : IDL.Func(
        [],
        [BackupStatistics],
        ['query'],
      ),
    'get_individual_users_backup_data_entry' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(AllUserData)],
        ['query'],
      ),
    'get_user_roles' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(UserAccessRole)],
        ['query'],
      ),
    'get_well_known_principal_value' : IDL.Func(
        [KnownPrincipalType],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'receive_all_token_transactions_from_individual_user_canister' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Nat64, TokenEvent)), IDL.Principal],
        [],
        [],
      ),
    'receive_all_user_posts_from_individual_user_canister' : IDL.Func(
        [IDL.Vec(Post), IDL.Principal],
        [],
        [],
      ),
    'receive_current_token_balance_from_individual_user_canister' : IDL.Func(
        [IDL.Nat64, IDL.Principal],
        [],
        [],
      ),
    'receive_principals_i_follow_from_individual_user_canister' : IDL.Func(
        [IDL.Vec(IDL.Principal), IDL.Principal],
        [],
        [],
      ),
    'receive_principals_that_follow_me_from_individual_user_canister' : IDL.Func(
        [IDL.Vec(IDL.Principal), IDL.Principal],
        [],
        [],
      ),
    'receive_profile_details_from_individual_user_canister' : IDL.Func(
        [UserProfile, IDL.Principal, IDL.Principal],
        [],
        [],
      ),
    'restore_backed_up_data_to_individual_users_canister' : IDL.Func(
        [IDL.Principal],
        [IDL.Text],
        [],
      ),
    'send_restore_data_back_to_user_index_canister' : IDL.Func([], [], []),
    'update_user_add_role' : IDL.Func([UserAccessRole, IDL.Principal], [], []),
    'update_user_remove_role' : IDL.Func(
        [UserAccessRole, IDL.Principal],
        [],
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
  const UserAccessRole = IDL.Variant({
    'CanisterController' : IDL.Null,
    'ProfileOwner' : IDL.Null,
    'CanisterAdmin' : IDL.Null,
    'ProjectCanister' : IDL.Null,
  });
  const DataBackupInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
    'access_control_map' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(UserAccessRole)))
    ),
  });
  return [DataBackupInitArgs];
};
