export const log = {
	trace: (message?: any, ...args: any[]) =>
		console.trace('[trace]', message, ...args),
	debug: (message?: any, ...args: any[]) =>
		console.debug('[debug]', message, ...args),
	info: (message?: any, ...args: any[]) =>
		console.log('[info ]', message, ...args),
	warn: (message?: any, ...args: any[]) =>
		console.warn('[warn ]', message, ...args),
	error: (message?: any, ...args: any[]) =>
		console.error('[error]', message, ...args),
} as const;
