export type Logger = {
	trace: (message?: any, ...args: any[]) => void;
	debug: (message?: any, ...args: any[]) => void;
	info: (message?: any, ...args: any[]) => void;
	warn: (message?: any, ...args: any[]) => void;
	error: (message?: any, ...args: any[]) => void;
};

export type FileSystem = {
	readFileSync: (path: string) => string;
	writeFileSync: (path: string, data: string) => void;
	existsSync: (path: string) => boolean;
};
