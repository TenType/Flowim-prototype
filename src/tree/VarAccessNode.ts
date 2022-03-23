import AST from './AST';
import Token from '../Token';
import Position from '../Position';

import { inspect } from 'util';
import Scope from '../context/Scope';
import RuntimeError from '../logger/errors/RuntimeError';

export default class VarAccessNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(public token: Token) {
		super();
		this.start = this.token.start;
		this.end = this.token.end;
	}

	public visit(scope: Scope) {
		const name = this.token.value as string;
		const data = scope.symbolTable.get(name)?.copy();

		if (data == null) {
			RuntimeError.emit(`'${name}' is not defined`, 'This is undefined', this.start, this.end, scope);
		}

		data.start = this.start, data.end = this.end;
		return data;
	}

	[inspect.custom]() {
		return `${this.token[inspect.custom]()}`;
	}
}