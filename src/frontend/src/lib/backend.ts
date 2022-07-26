import { createActor, canisterId } from '../../declarations/backend';

export const host =
	process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://ic0.app';

export const backend = createActor(canisterId ?? '', {
	agentOptions: {
		host
	}
});
