export const idlFactory = ({ IDL }) => {
  const KnownPrincipalType = IDL.Variant({
    'CanisterIdUserIndex' : IDL.Null,
    'CanisterIdTopicCacheIndex' : IDL.Null,
    'CanisterIdRootCanister' : IDL.Null,
    'CanisterIdPostCache' : IDL.Null,
    'CanisterIdSNSController' : IDL.Null,
    'UserIdGlobalSuperAdmin' : IDL.Null,
  });
  const UserIndexInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Vec(
      IDL.Tuple(KnownPrincipalType, IDL.Principal)
    ),
  });
  const UpdateProfileSetUniqueUsernameError = IDL.Variant({
    'UsernameAlreadyTaken' : IDL.Null,
    'UserIndexCrossCanisterCallFailed' : IDL.Null,
    'SendingCanisterDoesNotMatchUserCanisterId' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'UserCanisterEntryDoesNotExist' : IDL.Null,
  });
  const Result = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : UpdateProfileSetUniqueUsernameError,
  });
  const CanisterStatusType = IDL.Variant({
    'stopped' : IDL.Null,
    'stopping' : IDL.Null,
    'running' : IDL.Null,
  });
  const DefiniteCanisterSettings = IDL.Record({
    'freezing_threshold' : IDL.Nat,
    'controllers' : IDL.Vec(IDL.Principal),
    'memory_allocation' : IDL.Nat,
    'compute_allocation' : IDL.Nat,
  });
  const CanisterStatusResponse = IDL.Record({
    'status' : CanisterStatusType,
    'memory_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'settings' : DefiniteCanisterSettings,
    'idle_cycles_burned_per_day' : IDL.Nat,
    'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const SystemTime = IDL.Record({
    'nanos_since_epoch' : IDL.Nat32,
    'secs_since_epoch' : IDL.Nat64,
  });
  const UpgradeStatus = IDL.Record({
    'version_number' : IDL.Nat64,
    'last_run_on' : SystemTime,
    'failed_canister_ids' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Principal)),
    'successful_upgrade_count' : IDL.Nat32,
  });
  const UserAccessRole = IDL.Variant({
    'CanisterController' : IDL.Null,
    'ProfileOwner' : IDL.Null,
    'CanisterAdmin' : IDL.Null,
    'ProjectCanister' : IDL.Null,
  });
  const SetUniqueUsernameError = IDL.Variant({
    'UsernameAlreadyTaken' : IDL.Null,
    'SendingCanisterDoesNotMatchUserCanisterId' : IDL.Null,
    'UserCanisterEntryDoesNotExist' : IDL.Null,
  });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : SetUniqueUsernameError,
  });
  return IDL.Service({
    'ask_individual_canisters_to_send_me_their_unique_username_if_set' : IDL.Func(
        [],
        [Result],
        [],
      ),
    'delete_user_index_reset_user_canisters' : IDL.Func([], [], []),
    'get_canister_status_from_management_canister' : IDL.Func(
        [IDL.Principal],
        [CanisterStatusResponse],
        [],
      ),
    'get_index_details_is_user_name_taken' : IDL.Func(
        [IDL.Text],
        [IDL.Bool],
        ['query'],
      ),
    'get_index_details_last_upgrade_status' : IDL.Func(
        [],
        [UpgradeStatus],
        ['query'],
      ),
    'get_user_canister_id_from_unique_user_name' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'get_user_canister_id_from_user_principal_id' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id' : IDL.Func(
        [],
        [IDL.Principal],
        [],
      ),
    'get_user_roles' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(UserAccessRole)],
        ['query'],
      ),
    'topup_canisters_that_need_it' : IDL.Func([], [], []),
    'update_index_with_unique_user_name_corresponding_to_user_principal_id' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_1],
        [],
      ),
    'update_index_with_unique_user_name_corresponding_to_user_principal_id_allow_same_username_from_existing_principal' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_1],
        [],
      ),
    'update_user_add_role' : IDL.Func([UserAccessRole, IDL.Principal], [], []),
    'update_user_index_upgrade_user_canisters_with_latest_wasm' : IDL.Func(
        [],
        [UpgradeStatus],
        [],
      ),
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
  const UserIndexInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Vec(
      IDL.Tuple(KnownPrincipalType, IDL.Principal)
    ),
  });
  return [UserIndexInitArgs];
};
