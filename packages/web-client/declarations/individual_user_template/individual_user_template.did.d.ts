import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'create_post' : ActorMethod<[string, Array<string>, string], bigint>,
  'mark_post_as_ready_to_view' : ActorMethod<[bigint], undefined>,
}
