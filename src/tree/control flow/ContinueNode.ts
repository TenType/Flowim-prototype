import AST from '../AST';
import Position from '../../Position';
import Scope from '../../context/Scope';

import { inspect } from 'util';
import RuntimeError from '../../logger/errors/RuntimeError';

export class ContinueInterrupt extends RuntimeError {
	public constructor(start: Position, end: Position, scope: Scope) {
		super({
			details: "'continue' can only be used in a loop or iteration",
			highlight: "Invalid 'continue' statement here",
			start, end, scope,
		});
	}
}

export default class ContinueNode extends AST {
	public constructor(public start: Position, public end: Position) {
		super();
	}

	public visit(scope: Scope): never {
		throw new ContinueInterrupt(this.start, this.end, scope);
	}

	[inspect.custom]() {
		return 'continue';
	}
}