export const idlFactory = ({ IDL }) => {
  const KnownPrincipalType = IDL.Variant({
    'CanisterIdUserIndex' : IDL.Null,
    'CanisterIdProjectMemberIndex' : IDL.Null,
    'CanisterIdTopicCacheIndex' : IDL.Null,
    'CanisterIdRootCanister' : IDL.Null,
    'CanisterIdPostCache' : IDL.Null,
    'CanisterIdSNSController' : IDL.Null,
    'UserIdGlobalSuperAdmin' : IDL.Null,
  });
  const ProjectMemberIndexInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Vec(
      IDL.Tuple(KnownPrincipalType, IDL.Principal)
    ),
  });
  const UserAccessRole = IDL.Variant({
    'CanisterController' : IDL.Null,
    'ProfileOwner' : IDL.Null,
    'CanisterAdmin' : IDL.Null,
    'ProjectCanister' : IDL.Null,
  });
  return IDL.Service({
    'get_user_roles' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(UserAccessRole)],
        ['query'],
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
    'CanisterIdProjectMemberIndex' : IDL.Null,
    'CanisterIdTopicCacheIndex' : IDL.Null,
    'CanisterIdRootCanister' : IDL.Null,
    'CanisterIdPostCache' : IDL.Null,
    'CanisterIdSNSController' : IDL.Null,
    'UserIdGlobalSuperAdmin' : IDL.Null,
  });
  const ProjectMemberIndexInitArgs = IDL.Record({
    'known_principal_ids' : IDL.Vec(
      IDL.Tuple(KnownPrincipalType, IDL.Principal)
    ),
  });
  return [ProjectMemberIndexInitArgs];
};
