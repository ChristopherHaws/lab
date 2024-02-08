import { findAll } from 'tsconfck';

(async () => {
	console.log('Hello World!!');

	console.log(await findAll('C:/Users/chaws/dev/chaws/lab/', {
		skip(dir) {
			return ['node_modules', '.git', '.vscode'].includes(dir);
		},
	}))
	console.log('Done!!');
})();
