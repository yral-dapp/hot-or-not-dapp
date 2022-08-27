import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  '__comment_this_reset_user_canisters' : ActorMethod<[], undefined>,
  'get_users_canister' : ActorMethod<[], Principal>,
}
