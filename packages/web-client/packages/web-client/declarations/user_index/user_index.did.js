export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    '__comment_this_reset_user_canisters' : IDL.Func([], [], []),
    'get_users_canister' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
