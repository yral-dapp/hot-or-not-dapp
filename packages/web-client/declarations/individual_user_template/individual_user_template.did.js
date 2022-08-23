export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'create_post' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text), IDL.Text],
        [IDL.Nat64],
        [],
      ),
    'mark_post_as_ready_to_view' : IDL.Func([IDL.Nat64], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
