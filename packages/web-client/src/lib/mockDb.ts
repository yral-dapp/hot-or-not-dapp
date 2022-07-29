const videos = [
	'https://assets.mixkit.co/videos/preview/mixkit-weeds-waving-in-the-breeze-1178-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-stunning-sunset-seen-from-the-sea-4119-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-metal-surface-engraved-with-ornaments-34505-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-a-brush-painting-on-a-blue-wall-2308-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-computer-fan-with-neon-lights-2382-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-fountain-in-a-garden-2674-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-old-street-at-night-3456-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-tourists-skiing-on-a-snowy-slope-in-canada-3351-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-pink-and-blue-ink-1192-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-young-man-dancing-upside-down-on-a-pedestrian-bridge-3627-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-the-spheres-of-a-christmas-tree-2720-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-dynamic-animation-of-the-head-of-a-screaming-man-32645-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-under-a-peripheral-road-with-two-avenues-on-the-sides-34560-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-two-avenues-with-many-cars-traveling-at-night-34562-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-on-bridges-and-streets-34565-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-pink-flowers-wave-in-the-breeze-1168-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-a-skater-skating-on-a-half-1364-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-dog-standing-on-a-log-1555-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-elevated-electric-train-1600-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-lens-taking-photos-2373-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-footballer-headbutting-the-ball-2923-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-flames-burning-inside-a-bbq-grill-2780-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-sparks-of-fire-on-a-black-background-3463-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-popping-dancers-performing-at-abandoned-place-3630-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-man-playing-drums-with-sepia-filter-3610-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-old-street-at-night-3456-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-tourists-skiing-on-a-snowy-slope-in-canada-3351-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-reading-in-pajamas-4950-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-ice-falling-into-a-glass-with-soda-5083-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-artist-working-in-her-studio-5175-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-domino-effect-on-dark-background-5253-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-bartender-serving-beer-from-a-tap-looking-down-at-his-8709-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-gummy-bears-lined-up-on-a-white-background-10382-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-red-berries-served-in-a-bowl-on-a-wooden-table-10427-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-serving-juice-in-a-glass-with-some-oranges-on-a-10428-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-representation-of-a-sunrise-made-with-homemade-materials-13769-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-blue-sky-with-clouds-moving-with-the-wind-26112-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-fire-line-to-the-floor-of-the-entrance-to-a-33874-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-decorated-for-halloween-with-a-pumpkin-spiders-smoke-and-candles-33890-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-young-man-playing-an-online-video-game-43532-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-small-pickup-truck-in-a-wide-dirt-desert-40066-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-cyborg-being-prepared-40203-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-jazz-musicians-playing-in-the-street-40397-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-young-man-moving-while-playing-a-vr-video-game-40463-large.mp4'
];

export const db = {
	getVideos: (skipCount: number, count: number) => {
		return {
			videos: videos.slice(skipCount - 1, count),
			nextCount: count + 1
		};
	}
};
