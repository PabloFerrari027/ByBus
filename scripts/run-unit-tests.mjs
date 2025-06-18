import { glob } from 'glob';
import { spawn } from 'child_process';

const fileToTest = process.argv[2];

let testFiles = [];

if (fileToTest) {
	testFiles = [fileToTest];
} else {
	testFiles = await glob('src/**/*.unit.test.ts');
}

if (testFiles.length === 0) {
	console.error('Nenhum arquivo de teste encontrado.');
	process.exit(1);
}

const nodeArgs = ['--no-warnings', '--loader=ts-node/esm', '--test', ...testFiles];

const child = spawn('node', nodeArgs, { stdio: 'inherit' });

child.on('exit', code => {
	process.exit(code ?? 0);
});
