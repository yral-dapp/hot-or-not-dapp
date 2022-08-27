export const idlFactory = ({ IDL }) => {
  const PostDetailsFromFrontend = IDL.Record({
    'hashtags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'video_url' : IDL.Text,
  });
  return IDL.Service({
    'create_post' : IDL.Func([PostDetailsFromFrontend], [IDL.Nat64], []),
    'mark_post_as_ready_to_view' : IDL.Func([IDL.Nat64], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
