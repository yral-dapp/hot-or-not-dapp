import type { Principal } from '@dfinity/principal';
import { writable } from 'svelte-local-storage-store';

export default writable<{
	unique_user_name: [] | [string];
	profile_picture_url: [] | [string];
	display_name: [] | [string];
	principal_id?: Principal;
	followers: Principal[];
	following: Principal[];
	profile_stats: {
		lifetime_earnings: number;
		hots_earned_count: number;
		nots_earned_count: number;
	};
}>('user-profile', {
	unique_user_name: [],
	profile_picture_url: [],
	display_name: [],
	followers: [],
	following: [],
	profile_stats: {
		lifetime_earnings: 0,
		hots_earned_count: 0,
		nots_earned_count: 0
	}
});
