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
    'CanisterIdSnsGovernance' : IDL.Null,
    'UserIdGlobalSuperAdmin' : IDL.Null,
  });
  const PostCacheInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
    'version' : IDL.Text,
    'upgrade_version_number' : IDL.Opt(IDL.Nat64),
  });
  const PostScoreIndexItem = IDL.Record({
    'post_id' : IDL.Nat64,
    'score' : IDL.Nat64,
    'publisher_canister_id' : IDL.Principal,
  });
  const TopPostsFetchError = IDL.Variant({
    'ReachedEndOfItemsList' : IDL.Null,
    'InvalidBoundsPassed' : IDL.Null,
    'ExceededMaxNumberOfItemsAllowedInOneRequest' : IDL.Null,
  });
  const Result = IDL.Variant({
    'Ok' : IDL.Vec(PostScoreIndexItem),
    'Err' : TopPostsFetchError,
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
  const SystemTime = IDL.Record({
    'nanos_since_epoch' : IDL.Nat32,
    'secs_since_epoch' : IDL.Nat64,
  });
  const PostScoreIndexItemV1 = IDL.Record({
    'is_nsfw' : IDL.Bool,
    'status' : PostStatus,
    'post_id' : IDL.Nat64,
    'created_at' : IDL.Opt(SystemTime),
    'score' : IDL.Nat64,
    'publisher_canister_id' : IDL.Principal,
  });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(PostScoreIndexItemV1),
    'Err' : TopPostsFetchError,
  });
  return IDL.Service({
    'get_top_posts_aggregated_from_canisters_on_this_network_for_home_feed' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result],
        ['query'],
      ),
    'get_top_posts_aggregated_from_canisters_on_this_network_for_home_feed_cursor' : IDL.Func(
        [IDL.Nat64, IDL.Nat64, IDL.Opt(IDL.Bool), IDL.Opt(PostStatus)],
        [Result_1],
        ['query'],
      ),
    'get_top_posts_aggregated_from_canisters_on_this_network_for_hot_or_not_feed' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result],
        ['query'],
      ),
    'get_top_posts_aggregated_from_canisters_on_this_network_for_hot_or_not_feed_cursor' : IDL.Func(
        [IDL.Nat64, IDL.Nat64, IDL.Opt(IDL.Bool), IDL.Opt(PostStatus)],
        [Result_1],
        ['query'],
      ),
    'get_well_known_principal_value' : IDL.Func(
        [KnownPrincipalType],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'receive_top_home_feed_posts_from_publishing_canister' : IDL.Func(
        [IDL.Vec(PostScoreIndexItemV1)],
        [],
        [],
      ),
    'receive_top_hot_or_not_feed_posts_from_publishing_canister' : IDL.Func(
        [IDL.Vec(PostScoreIndexItemV1)],
        [],
        [],
      ),
    'remove_all_feed_entries' : IDL.Func([], [], []),
    'update_post_home_feed' : IDL.Func([PostScoreIndexItemV1], [], []),
    'update_post_hot_or_not_feed' : IDL.Func([PostScoreIndexItemV1], [], []),
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
    'CanisterIdSnsGovernance' : IDL.Null,
    'UserIdGlobalSuperAdmin' : IDL.Null,
  });
  const PostCacheInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
    'version' : IDL.Text,
    'upgrade_version_number' : IDL.Opt(IDL.Nat64),
  });
  return [PostCacheInitArgs];
};
