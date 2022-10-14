export const idlFactory = ({ IDL }) => {
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
  const Result = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : SetUniqueUsernameError,
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
  return IDL.Service({
    'delete_user_index_reset_user_canisters' : IDL.Func([], [], []),
    'get_index_details_is_user_name_taken' : IDL.Func(
        [IDL.Text],
        [IDL.Bool],
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
    'update_index_with_unique_user_name_corresponding_to_user_principal_id' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result],
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
export const init = ({ IDL }) => { return []; };
