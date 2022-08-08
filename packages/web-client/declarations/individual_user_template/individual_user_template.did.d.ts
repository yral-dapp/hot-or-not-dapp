import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'return_my_principal' : ActorMethod<[], Principal>,
  'say_hello' : ActorMethod<[string], string>,
}
