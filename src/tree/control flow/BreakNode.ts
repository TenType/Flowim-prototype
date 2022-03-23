import AST from '../AST';
import Position from '../../Position';
import Scope from '../../context/Scope';

import { inspect } from 'util';
import RuntimeError from '../../logger/errors/RuntimeError';

export class BreakInterrupt extends RuntimeError {
	public constructor(start: Position, end: Position, scope: Scope) {
		super({
			details: "'break' can only be used in a loop or iteration",
			highlight: "Invalid 'break' statement here",
			start, end, scope,
		});
	}
}

export default class BreakNode extends AST {
	public constructor(public start: Position, public end: Position) {
		super();
	}

	public visit(scope: Scope): never {
		throw new BreakInterrupt(this.start, this.end, scope);
	}

	[inspect.custom]() {
		return 'break';
	}
}