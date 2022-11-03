export default (data: any, type: 'log' | 'info' | 'warn' | 'error') => {
	if (process.env.NODE_ENV == 'development' || type == 'error') {
		console[type](type, data);
	}
};
