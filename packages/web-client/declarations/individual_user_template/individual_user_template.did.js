export const idlFactory = ({ IDL }) => {
  const KnownPrincipalType = IDL.Variant({
    'CanisterIdUserIndex' : IDL.Null,
    'CanisterIdTopicCacheIndex' : IDL.Null,
    'CanisterIdRootCanister' : IDL.Null,
    'CanisterIdPostCache' : IDL.Null,
    'CanisterIdSNSController' : IDL.Null,
    'UserIdGlobalSuperAdmin' : IDL.Null,
  });
  const IndividualUserTemplateInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Vec(
      IDL.Tuple(KnownPrincipalType, IDL.Principal)
    ),
    'profile_owner' : IDL.Principal,
  });
  const PostDetailsFromFrontend = IDL.Record({
    'hashtags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'video_uid' : IDL.Text,
    'creator_consent_for_inclusion_in_hot_or_not' : IDL.Bool,
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
  const PostDetailsForFrontend = IDL.Record({
    'id' : IDL.Nat64,
    'status' : PostStatus,
    'hashtags' : IDL.Vec(IDL.Text),
    'like_count' : IDL.Nat64,
    'description' : IDL.Text,
    'total_view_count' : IDL.Nat64,
    'created_by_display_name' : IDL.Opt(IDL.Text),
    'created_by_unique_user_name' : IDL.Opt(IDL.Text),
    'video_uid' : IDL.Text,
    'created_by_user_principal_id' : IDL.Principal,
    'liked_by_me' : IDL.Bool,
    'created_by_profile_photo_url' : IDL.Opt(IDL.Text),
  });
  const GetPostsOfUserProfileError = IDL.Variant({
    'ReachedEndOfItemsList' : IDL.Null,
    'InvalidBoundsPassed' : IDL.Null,
    'ExceededMaxNumberOfItemsAllowedInOneRequest' : IDL.Null,
  });
  const Result = IDL.Variant({
    'Ok' : IDL.Vec(PostDetailsForFrontend),
    'Err' : GetPostsOfUserProfileError,
  });
  const GetFollowerOrFollowingError = IDL.Variant({
    'ReachedEndOfItemsList' : IDL.Null,
    'InvalidBoundsPassed' : IDL.Null,
    'ExceededMaxNumberOfItemsAllowedInOneRequest' : IDL.Null,
  });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Principal),
    'Err' : GetFollowerOrFollowingError,
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
  const UserAccessRole = IDL.Variant({
    'CanisterController' : IDL.Null,
    'ProfileOwner' : IDL.Null,
    'CanisterAdmin' : IDL.Null,
    'ProjectCanister' : IDL.Null,
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
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : FollowAnotherUserProfileError,
  });
  const AnotherUserFollowedMeError = IDL.Variant({
    'UserIndexCrossCanisterCallFailed' : IDL.Null,
    'FollowersListFull' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'UserTryingToFollowMeDoesNotExist' : IDL.Null,
  });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : AnotherUserFollowedMeError,
  });
  const UserProfileUpdateDetailsFromFrontend = IDL.Record({
    'profile_picture_url' : IDL.Opt(IDL.Text),
    'display_name' : IDL.Opt(IDL.Text),
  });
  const UpdateProfileDetailsError = IDL.Variant({ 'NotAuthorized' : IDL.Null });
  const Result_4 = IDL.Variant({
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
  const Result_5 = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : UpdateProfileSetUniqueUsernameError,
  });
  return IDL.Service({
    'add_post' : IDL.Func([PostDetailsFromFrontend], [IDL.Nat64], []),
    'get_following_status_do_i_follow_this_user' : IDL.Func(
        [IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'get_individual_post_details_by_id' : IDL.Func(
        [IDL.Nat64],
        [PostDetailsForFrontend],
        ['query'],
      ),
    'get_individual_post_score_by_id' : IDL.Func(
        [IDL.Nat64],
        [IDL.Nat64],
        ['query'],
      ),
    'get_posts_of_this_user_profile_with_pagination' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result],
        ['query'],
      ),
    'get_principals_i_follow_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_1],
        ['query'],
      ),
    'get_principals_that_follow_me_paginated' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_1],
        ['query'],
      ),
    'get_profile_details' : IDL.Func(
        [],
        [UserProfileDetailsForFrontend],
        ['query'],
      ),
    'get_user_roles' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(UserAccessRole)],
        ['query'],
      ),
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
        [Result_2],
        [],
      ),
    'update_principals_that_follow_me_toggle_list_with_specified_principal' : IDL.Func(
        [IDL.Principal],
        [Result_3],
        [],
      ),
    'update_profile_display_details' : IDL.Func(
        [UserProfileUpdateDetailsFromFrontend],
        [Result_4],
        [],
      ),
    'update_profile_resend_username_to_user_index_canister' : IDL.Func(
        [],
        [Result_5],
        [],
      ),
    'update_profile_set_unique_username_once' : IDL.Func(
        [IDL.Text],
        [Result_5],
        [],
      ),
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
    'CanisterIdTopicCacheIndex' : IDL.Null,
    'CanisterIdRootCanister' : IDL.Null,
    'CanisterIdPostCache' : IDL.Null,
    'CanisterIdSNSController' : IDL.Null,
    'UserIdGlobalSuperAdmin' : IDL.Null,
  });
  const IndividualUserTemplateInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Vec(
      IDL.Tuple(KnownPrincipalType, IDL.Principal)
    ),
    'profile_owner' : IDL.Principal,
  });
  return [IndividualUserTemplateInitArgs];
};
