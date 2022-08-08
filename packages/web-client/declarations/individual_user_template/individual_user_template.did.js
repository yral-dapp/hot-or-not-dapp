export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'return_my_principal' : IDL.Func([], [IDL.Principal], ['query']),
    'say_hello' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
