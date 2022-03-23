import AST from '../AST';
import Position from '../../Position';
import { NodeReturn } from '../AST';
import Scope from '../../context/Scope';

import { inspect } from 'util';

import RuntimeError from '../../logger/errors/RuntimeError';
import NullLiteral from '../../literals/NullLiteral';
import { LiteralTypes } from '../../literals/BaseLiteral';

export class ReturnInterrupt extends RuntimeError {
	public constructor(public value: LiteralTypes, start: Position, end: Position, scope: Scope) {
		super({
			details: "'return' can only be used in a function",
			highlight: "Invalid 'return' statement here",
			start, end, scope,
		});
	}
}

export default class ReturnNode extends AST {
	public constructor(private node: NodeReturn | null, public start: Position, public end: Position) {
		super();
	}

	public visit(scope: Scope): never {
		// const value = this.node == null
		// 	? new NullLiteral(null, this.start, this.end, scope)
		// 	: this.node.visit(scope);

		throw new ReturnInterrupt(this.node?.visit(scope), this.start, this.end, scope);
	}

	[inspect.custom]() {
		return `return: ${this.node}`;
	}
}