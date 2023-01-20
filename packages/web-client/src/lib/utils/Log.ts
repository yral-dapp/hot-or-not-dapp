import * as Sentry from '@sentry/svelte';

function replaceErrors(_, value) {
	if (value instanceof Error) {
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
	if (import.meta.env.NODE_ENV == 'development' || type == 'error') {
		console[type](logTypeMap[type], dataStr);
	}
	if (type === 'error') {
		Sentry.captureException(dataStr);
	}
};
