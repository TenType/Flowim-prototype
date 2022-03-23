import FuncLiteral from '../literals/FuncLiteral';
import StrLiteral from '../literals/StrLiteral';
import RuntimeError from '../logger/errors/RuntimeError';

import run from '../Runner';

export default new FuncLiteral('eval', ['code'], ({ start, end, scope }, { code }) => {
	if (!(code instanceof StrLiteral)) {
		RuntimeError.emit('Code must be a string', `Expected type 'str', received type '${code.strRepr}'`, start, end, scope);
	}
	console.log(run(scope.name, code.value));
});