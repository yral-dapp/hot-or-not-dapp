export default (data: any, type: 'log' | 'info' | 'warn' | 'error') => {
	if (process.env.NODE_ENV !== 'development') {
		console[type](data);
	}
};
