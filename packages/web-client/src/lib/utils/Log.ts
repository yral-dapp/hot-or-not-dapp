import { browser } from '$app/environment';
import * as Sentry from '@sentry/svelte';

function replaceErrors(_, value) {
	if (typeof value === 'bigint') {
		return Number(value);
	} else if (value instanceof Error) {
		const error = {};

		Object.getOwnPropertyNames(value).forEach((propName) => {
			error[propName] = value[propName];
		});

		return error;
	}

	return value;
}

type Logs = 'log' | 'info' | 'warn' | 'error';

const logTypeMap: Record<Logs, string> = {
	log: '📺',
	info: 'ℹ️',
	warn: '⚠️',
	error: '🚨'
};

export default (data: any, type: Logs) => {
	const dataStr = JSON.stringify(data, replaceErrors) || data;
	const localhost = browser
		? location.host.includes('localhost')
		: import.meta.env.NODE_ENV !== 'production';
	if (localhost || type == 'error') {
		console[type](logTypeMap[type], dataStr);
	}
	if (type === 'error') {
		Sentry.captureException(dataStr);
	}
};
