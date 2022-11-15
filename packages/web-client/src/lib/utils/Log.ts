export default (data: any, type: 'log' | 'info' | 'warn' | 'error') => {
	if (import.meta.env.NODE_ENV == 'development' || type == 'error') {
		console[type](type, data);
	}
};
