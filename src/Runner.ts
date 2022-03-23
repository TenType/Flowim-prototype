import Lexer from './Lexer';
import Parser from './parser/Parser';
import Interpreter from './Interpreter';

import BaseError from './logger/errors/BaseError';
import Scope from './context/Scope';

// const perf = '\u001b[35;1mperf\u001b[0m';

export default function run(file: string, code: string) {
	try {
		// console.time(perf);
		// Lexer
		const tokens = new Lexer(file, code).run();
		// console.log('lexer\n', tokens);

		// Parser
		const AST = new Parser(tokens).run();
		// console.log('\u001b[33;1mparser\u001b[0m\n', inspect(AST, false, null, true));
		// console.dir(AST, { depth: null });

		// Interpreter
		const output = Interpreter.run(AST, new Scope('<main>'));
		return output;
		// console.log('\u001b[32;1moutput\u001b[0m\n', output);
		// console.timeEnd(perf);

	} catch (error) {
		if (error instanceof BaseError) {
			console.error(error.message);
			// console.timeEnd(perf);
			return;
		}
		throw error;
	}
}