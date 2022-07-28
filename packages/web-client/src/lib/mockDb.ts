const videos = [
	'https://assets.mixkit.co/videos/preview/mixkit-weeds-waving-in-the-breeze-1178-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-stunning-sunset-seen-from-the-sea-4119-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-metal-surface-engraved-with-ornaments-34505-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-a-brush-painting-on-a-blue-wall-2308-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-computer-fan-with-neon-lights-2382-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-fountain-in-a-garden-2674-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-old-street-at-night-3456-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-tourists-skiing-on-a-snowy-slope-in-canada-3351-large.mp4'
];

export const db = {
	getVideos: (page: number) => {
		return videos.slice(page - 1, 4);
	}
};
