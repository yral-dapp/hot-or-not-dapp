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
  const PostCacheInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
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
  return IDL.Service({
    'get_top_posts_aggregated_from_canisters_on_this_network_for_home_feed' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result],
        ['query'],
      ),
    'get_top_posts_aggregated_from_canisters_on_this_network_for_hot_or_not_feed' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result],
        ['query'],
      ),
    'get_well_known_principal_value' : IDL.Func(
        [KnownPrincipalType],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'receive_top_home_feed_posts_from_publishing_canister' : IDL.Func(
        [IDL.Vec(PostScoreIndexItem)],
        [],
        [],
      ),
    'receive_top_hot_or_not_feed_posts_from_publishing_canister' : IDL.Func(
        [IDL.Vec(PostScoreIndexItem)],
        [],
        [],
      ),
    'remove_all_feed_entries' : IDL.Func([], [], []),
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
  const PostCacheInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
  });
  return [PostCacheInitArgs];
};
