import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface PostDetailsFromFrontend {
  'hashtags' : Array<string>,
  'description' : string,
  'video_url' : string,
}
export interface _SERVICE {
  'create_post' : ActorMethod<[PostDetailsFromFrontend], bigint>,
  'mark_post_as_ready_to_view' : ActorMethod<[bigint], undefined>,
}
