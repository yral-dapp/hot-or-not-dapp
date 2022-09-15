export const idlFactory = ({ IDL }) => {
  const PostDetailsFromFrontend = IDL.Record({
    'hashtags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'video_uid' : IDL.Text,
    'creator_consent_for_inclusion_in_hot_or_not' : IDL.Bool,
  });
  const PostStatus = IDL.Variant({
    'BannedForExplicitness' : IDL.Null,
    'BannedDueToUserReporting' : IDL.Null,
    'Uploaded' : IDL.Null,
    'CheckingExplicitness' : IDL.Null,
    'ReadyToView' : IDL.Null,
    'Transcoding' : IDL.Null,
    'Deleted' : IDL.Null,
  });
  const PostDetailsForFrontend = IDL.Record({
    'id' : IDL.Nat64,
    'status' : PostStatus,
    'hashtags' : IDL.Vec(IDL.Text),
    'like_count' : IDL.Nat64,
    'description' : IDL.Text,
    'total_view_count' : IDL.Nat64,
    'video_url' : IDL.Text,
    'created_by_username' : IDL.Opt(IDL.Text),
    'liked_by_me' : IDL.Bool,
    'created_by_profile_photo_url' : IDL.Opt(IDL.Text),
  });
  const UserProfileGlobalStats = IDL.Record({
    'lifetime_earnings' : IDL.Nat64,
    'hots_earned_count' : IDL.Nat64,
    'nots_earned_count' : IDL.Nat64,
  });
  const UserProfile = IDL.Record({
    'unique_user_name' : IDL.Opt(IDL.Text),
    'profile_picture_url' : IDL.Opt(IDL.Text),
    'display_name' : IDL.Opt(IDL.Text),
    'principal_id' : IDL.Principal,
    'followers' : IDL.Vec(IDL.Principal),
    'following' : IDL.Vec(IDL.Principal),
    'profile_stats' : UserProfileGlobalStats,
  });
  const UserAccessRole = IDL.Variant({
    'CanisterController' : IDL.Null,
    'ProfileOwner' : IDL.Null,
    'CanisterAdmin' : IDL.Null,
  });
  const PostViewDetailsFromFrontend = IDL.Variant({
    'WatchedMultipleTimes' : IDL.Record({
      'percentage_watched' : IDL.Nat8,
      'watch_count' : IDL.Nat8,
    }),
    'WatchedPartially' : IDL.Record({ 'percentage_watched' : IDL.Nat8 }),
  });
  const UserProfileDetailsFromFrontend = IDL.Record({
    'unique_user_name' : IDL.Opt(IDL.Text),
    'profile_picture_url' : IDL.Opt(IDL.Text),
    'display_name' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'add_post' : IDL.Func([PostDetailsFromFrontend], [IDL.Nat64], []),
    'get_posts_of_this_user_profile_with_pagination' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [IDL.Vec(PostDetailsForFrontend)],
        ['query'],
      ),
    'get_profile_details' : IDL.Func([], [UserProfile], ['query']),
    'get_user_roles' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(UserAccessRole)],
        ['query'],
      ),
    'update_post_add_view_details' : IDL.Func(
        [IDL.Nat64, PostViewDetailsFromFrontend],
        [],
        [],
      ),
    'update_post_as_ready_to_view' : IDL.Func([IDL.Nat64], [], []),
    'update_post_increment_share_count' : IDL.Func(
        [IDL.Nat64],
        [IDL.Nat64],
        [],
      ),
    'update_post_toggle_like_status_by_caller' : IDL.Func(
        [IDL.Nat64],
        [IDL.Bool],
        [],
      ),
    'update_profile_details' : IDL.Func(
        [UserProfileDetailsFromFrontend],
        [UserProfile],
        [],
      ),
    'update_profile_toggle_follower_list_of_followee_by_calling_principal' : IDL.Func(
        [],
        [IDL.Bool],
        [],
      ),
    'update_profile_toggle_following_list_of_follower_by_user_to_follow' : IDL.Func(
        [IDL.Principal],
        [IDL.Bool],
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
export const init = ({ IDL }) => { return []; };
