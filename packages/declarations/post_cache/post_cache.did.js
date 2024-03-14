export const idlFactory = ({ IDL }) => {
  const KnownPrincipalType = IDL.Variant({
    'CanisterIdUserIndex' : IDL.Null,
    'CanisterIdPlatformOrchestrator' : IDL.Null,
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
  const PostStatus = IDL.Variant({
    'BannedForExplicitness' : IDL.Null,
    'BannedDueToUserReporting' : IDL.Null,
    'Uploaded' : IDL.Null,
    'CheckingExplicitness' : IDL.Null,
    'ReadyToView' : IDL.Null,
    'Transcoding' : IDL.Null,
    'Deleted' : IDL.Null,
  });
  const NsfwFilter = IDL.Variant({
    'IncludeNsfw' : IDL.Null,
    'OnlyNsfw' : IDL.Null,
    'ExcludeNsfw' : IDL.Null,
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
  const TopPostsFetchError = IDL.Variant({
    'ReachedEndOfItemsList' : IDL.Null,
    'InvalidBoundsPassed' : IDL.Null,
    'ExceededMaxNumberOfItemsAllowedInOneRequest' : IDL.Null,
  });
  const Result = IDL.Variant({
    'Ok' : IDL.Vec(PostScoreIndexItemV1),
    'Err' : TopPostsFetchError,
  });
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'status_code' : IDL.Nat16,
  });
  return IDL.Service({
    'get_cycle_balance' : IDL.Func([], [IDL.Nat], ['query']),
    'get_top_posts_aggregated_from_canisters_on_this_network_for_home_feed_cursor' : IDL.Func(
        [
          IDL.Nat64,
          IDL.Nat64,
          IDL.Opt(IDL.Bool),
          IDL.Opt(PostStatus),
          IDL.Opt(NsfwFilter),
        ],
        [Result],
        ['query'],
      ),
    'get_top_posts_aggregated_from_canisters_on_this_network_for_hot_or_not_feed_cursor' : IDL.Func(
        [
          IDL.Nat64,
          IDL.Nat64,
          IDL.Opt(IDL.Bool),
          IDL.Opt(PostStatus),
          IDL.Opt(NsfwFilter),
        ],
        [Result],
        ['query'],
      ),
    'get_well_known_principal_value' : IDL.Func(
        [KnownPrincipalType],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
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
    'CanisterIdPlatformOrchestrator' : IDL.Null,
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
