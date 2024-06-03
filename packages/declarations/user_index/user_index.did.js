export const idlFactory = ({ IDL }) => {
  const KnownPrincipalType = IDL.Variant({
    'CanisterIdUserIndex' : IDL.Null,
    'CanisterIdPlatformOrchestrator' : IDL.Null,
    'CanisterIdConfiguration' : IDL.Null,
    'CanisterIdHotOrNotSubnetOrchestrator' : IDL.Null,
    'CanisterIdProjectMemberIndex' : IDL.Null,
    'CanisterIdTopicCacheIndex' : IDL.Null,
    'CanisterIdRootCanister' : IDL.Null,
    'CanisterIdDataBackup' : IDL.Null,
    'CanisterIdPostCache' : IDL.Null,
    'CanisterIdSNSController' : IDL.Null,
    'CanisterIdSnsGovernance' : IDL.Null,
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
    'version' : IDL.Text,
    'access_control_map' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(UserAccessRole)))
    ),
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const SystemTime = IDL.Record({
    'nanos_since_epoch' : IDL.Nat32,
    'secs_since_epoch' : IDL.Nat64,
  });
  const UpgradeStatus = IDL.Record({
    'version_number' : IDL.Nat64,
    'version' : IDL.Text,
    'last_run_on' : SystemTime,
    'failed_canister_ids' : IDL.Vec(
      IDL.Tuple(IDL.Principal, IDL.Principal, IDL.Text)
    ),
    'successful_upgrade_count' : IDL.Nat32,
  });
  const RecycleStatus = IDL.Record({
    'last_recycled_duration' : IDL.Opt(IDL.Nat64),
    'last_recycled_at' : IDL.Opt(SystemTime),
    'num_last_recycled_canisters' : IDL.Nat64,
    'success_canisters' : IDL.Vec(IDL.Text),
    'failed_recycling' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text)),
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
  const QueryStats = IDL.Record({
    'response_payload_bytes_total' : IDL.Nat,
    'num_instructions_total' : IDL.Nat,
    'num_calls_total' : IDL.Nat,
    'request_payload_bytes_total' : IDL.Nat,
  });
  const CanisterStatusResponse = IDL.Record({
    'status' : CanisterStatusType,
    'memory_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'settings' : DefiniteCanisterSettings,
    'query_stats' : QueryStats,
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
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Tuple(CanisterStatusResponse),
    'Err' : IDL.Tuple(RejectionCode, IDL.Text),
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
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const SetUniqueUsernameError = IDL.Variant({
    'UsernameAlreadyTaken' : IDL.Null,
    'SendingCanisterDoesNotMatchUserCanisterId' : IDL.Null,
    'UserCanisterEntryDoesNotExist' : IDL.Null,
  });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : SetUniqueUsernameError,
  });
  const CanisterInstallMode = IDL.Variant({
    'reinstall' : IDL.Null,
    'upgrade' : IDL.Null,
    'install' : IDL.Null,
  });
  return IDL.Service({
    'are_signups_enabled' : IDL.Func([], [IDL.Bool], ['query']),
    'backup_all_individual_user_canisters' : IDL.Func([], [], []),
    'create_pool_of_individual_user_available_canisters' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8)],
        [Result],
        [],
      ),
    'get_current_list_of_all_well_known_principal_values' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(KnownPrincipalType, IDL.Principal))],
        ['query'],
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
    'get_list_of_available_canisters' : IDL.Func(
        [],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'get_recycle_status' : IDL.Func([], [RecycleStatus], ['query']),
    'get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer' : IDL.Func(
        [],
        [IDL.Principal],
        [],
      ),
    'get_subnet_available_capacity' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_subnet_backup_capacity' : IDL.Func([], [IDL.Nat64], ['query']),
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
    'get_user_canister_incl_avail_list' : IDL.Func(
        [],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'get_user_canister_list' : IDL.Func(
        [],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'get_user_canister_status' : IDL.Func([IDL.Principal], [Result_1], []),
    'get_user_id_and_canister_list' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Principal))],
        ['query'],
      ),
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
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'issue_rewards_for_referral' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [Result],
        [],
      ),
    'receive_data_from_backup_canister_and_restore_data_to_heap' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Text],
        [],
        [],
      ),
    'reclaim_cycles_from_individual_canisters' : IDL.Func([], [], []),
    'reset_user_individual_canisters' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result],
        [],
      ),
    'return_cycles_to_platform_orchestrator_canister' : IDL.Func(
        [],
        [Result],
        [],
      ),
    'set_permission_to_upgrade_individual_canisters' : IDL.Func(
        [IDL.Bool],
        [IDL.Text],
        [],
      ),
    'start_upgrades_for_individual_canisters' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8)],
        [IDL.Text],
        [],
      ),
    'toggle_signups_enabled' : IDL.Func([], [Result_2], []),
    'update_canisters_last_functionality_access_time' : IDL.Func(
        [],
        [IDL.Text],
        [],
      ),
    'update_index_with_unique_user_name_corresponding_to_user_principal_id' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_3],
        [],
      ),
    'update_profile_owner_for_individual_canisters' : IDL.Func([], [], []),
    'update_well_known_principal' : IDL.Func(
        [KnownPrincipalType, IDL.Principal],
        [],
        [],
      ),
    'upgrade_specific_individual_user_canister_with_latest_wasm' : IDL.Func(
        [IDL.Principal, IDL.Opt(IDL.Principal), IDL.Opt(CanisterInstallMode)],
        [IDL.Text],
        [],
      ),
    'validate_reset_user_individual_canisters' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => {
  const KnownPrincipalType = IDL.Variant({
    'CanisterIdUserIndex' : IDL.Null,
    'CanisterIdPlatformOrchestrator' : IDL.Null,
    'CanisterIdConfiguration' : IDL.Null,
    'CanisterIdHotOrNotSubnetOrchestrator' : IDL.Null,
    'CanisterIdProjectMemberIndex' : IDL.Null,
    'CanisterIdTopicCacheIndex' : IDL.Null,
    'CanisterIdRootCanister' : IDL.Null,
    'CanisterIdDataBackup' : IDL.Null,
    'CanisterIdPostCache' : IDL.Null,
    'CanisterIdSNSController' : IDL.Null,
    'CanisterIdSnsGovernance' : IDL.Null,
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
    'version' : IDL.Text,
    'access_control_map' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(UserAccessRole)))
    ),
  });
  return [UserIndexInitArgs];
};
