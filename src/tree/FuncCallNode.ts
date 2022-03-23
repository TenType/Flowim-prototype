import AST, { NodeReturn } from './AST';
import Position from '../Position';
import Scope from '../context/Scope';

import { inspect } from 'util';
import { LiteralTypes } from '../literals/BaseLiteral';
import FuncLiteral from '../literals/FuncLiteral';
import RuntimeError from '../logger/errors/RuntimeError';

export default class FuncCallNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(private callNode: NodeReturn, private args: NodeReturn[]) {
		super();
		this.start = callNode.start;
		if (args.length > 0) {
			this.end = args.at(-1).end;
		} else {
			this.end = callNode.end;
		}
	}

	public visit(scope: Scope): LiteralTypes {
		const args: LiteralTypes[] = [];
		const callValue = this.callNode.visit(scope).copy();

		if (!(callValue instanceof FuncLiteral)) {
			RuntimeError.emit('Non-function can not be called', 'This is not a function', this.start, this.end, scope);
		}

		callValue.start = this.start, callValue.end = this.end, callValue.scope = scope;
		for (let i = 0; i < this.args.length; i++) {
			args.push(this.args[i].visit(scope));
		}

		return callValue.execute(args);
	}

	[inspect.custom](): string {
		return `funcCall: ${this.callNode[inspect.custom]()}(${inspect(this.args, false, null, true)})`;
	}
}