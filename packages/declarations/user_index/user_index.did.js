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
  const UserIndexInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
    'access_control_map' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(UserAccessRole)))
    ),
  });
  const SystemTime = IDL.Record({
    'nanos_since_epoch' : IDL.Nat32,
    'secs_since_epoch' : IDL.Nat64,
  });
  const UpgradeStatus = IDL.Record({
    'version_number' : IDL.Nat64,
    'last_run_on' : SystemTime,
    'failed_canister_ids' : IDL.Vec(
      IDL.Tuple(IDL.Principal, IDL.Principal, IDL.Text)
    ),
    'successful_upgrade_count' : IDL.Nat32,
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
  const RejectionCode = IDL.Variant({
    'NoError' : IDL.Null,
    'CanisterError' : IDL.Null,
    'SysTransient' : IDL.Null,
    'DestinationInvalid' : IDL.Null,
    'Unknown' : IDL.Null,
    'SysFatal' : IDL.Null,
    'CanisterReject' : IDL.Null,
  });
  const Result = IDL.Variant({
    'Ok' : IDL.Tuple(CanisterStatusResponse),
    'Err' : IDL.Tuple(RejectionCode, IDL.Text),
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
  const CanisterInstallMode = IDL.Variant({
    'reinstall' : IDL.Null,
    'upgrade' : IDL.Null,
    'install' : IDL.Null,
  });
  return IDL.Service({
    'backup_all_individual_user_canisters' : IDL.Func([], [], []),
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
    'get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [IDL.Principal],
        [],
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
    'get_user_canister_status' : IDL.Func([IDL.Principal], [Result], []),
    'get_user_index_canister_count' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_user_index_canister_cycle_balance' : IDL.Func(
        [],
        [IDL.Nat],
        ['query'],
      ),
    'get_well_known_principal_value' : IDL.Func(
        [KnownPrincipalType],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'receive_data_from_backup_canister_and_restore_data_to_heap' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Text],
        [],
        [],
      ),
    'set_permission_to_upgrade_individual_canisters' : IDL.Func(
        [IDL.Bool],
        [IDL.Text],
        [],
      ),
    'start_upgrades_for_individual_canisters' : IDL.Func([], [IDL.Text], []),
    'update_index_with_unique_user_name_corresponding_to_user_principal_id' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_1],
        [],
      ),
    'upgrade_specific_individual_user_canister_with_latest_wasm' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Opt(CanisterInstallMode), IDL.Bool],
        [IDL.Text],
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
  const UserIndexInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Opt(
      IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))
    ),
    'access_control_map' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(UserAccessRole)))
    ),
  });
  return [UserIndexInitArgs];
};
