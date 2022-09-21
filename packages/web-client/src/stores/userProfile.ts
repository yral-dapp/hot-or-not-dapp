import type { Principal } from '@dfinity/principal';
import { writable } from 'svelte-local-storage-store';

export type UserProfile = {
	username_set: boolean;
	unique_user_name: string;
	profile_picture_url: string;
	display_name: string;
	principal_id?: Principal;
	followers: Principal[];
	following: Principal[];
	profile_stats: {
		lifetime_earnings: number;
		hots_earned_count: number;
		nots_earned_count: number;
	};
	updated_at: number;
};

export default writable<UserProfile>('user-profile', {
	username_set: false,
	unique_user_name: '',
	profile_picture_url: '',
	display_name: '',
	followers: [],
	following: [],
	profile_stats: {
		lifetime_earnings: 0,
		hots_earned_count: 0,
		nots_earned_count: 0
	},
	updated_at: Date.now()
});
