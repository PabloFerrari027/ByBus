import { glob } from 'glob';
import { spawn } from 'child_process';

const testFiles = await glob('src/**/*.unit.test.ts');

const c8Args = ['node', '--no-warnings', '--test', '--loader', 'ts-node/esm', ...testFiles];

const child = spawn('npx', ['c8', ...c8Args], {
	stdio: 'inherit',
	shell: true,
});

child.on('exit', code => {
	process.exit(code ?? 1);
});
