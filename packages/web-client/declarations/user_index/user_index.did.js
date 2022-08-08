export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get_users_canister' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
