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
  return IDL.Service({
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
    'receive_principal_id_to_canister_id_mapping_from_user_index_canister' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [],
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
