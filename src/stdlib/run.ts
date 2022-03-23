import { readFileSync, existsSync } from 'fs';

import FuncLiteral from '../literals/FuncLiteral';
import StrLiteral from '../literals/StrLiteral';
import RuntimeError from '../logger/errors/RuntimeError';

import run from '../Runner';

export default new FuncLiteral('run', ['fileName'], ({ start, end, scope }, { fileName }) => {
	if (!(fileName instanceof StrLiteral)) {
		RuntimeError.emit('File name must be a string', `Expected type 'str', received type '${fileName.strRepr}'`, start, end, scope);
	}
	if (!existsSync(fileName.value)) {
		RuntimeError.emit(`Could not find file '${fileName.value}'`, 'Unable to read non-existent file', start, end, scope);
	}
	const file = readFileSync(fileName.value, 'utf-8');
	run(fileName.value, file);
});