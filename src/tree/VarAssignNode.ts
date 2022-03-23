import AST from './AST';
import Token from '../Token';
import Position from '../Position';
import Scope from '../context/Scope';
import LiteralNode from './LiteralNode';
import NullLiteral from '../literals/NullLiteral';
import RuntimeError from '../logger/errors/RuntimeError';

import { inspect } from 'util';

export default class VarAssignNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(token: Token, private value: LiteralNode, private reassign: boolean) {
		super(token);
		this.start = this.token.start;
		this.end = this.value.end;
	}

	public visit(scope: Scope) {
		const name = this.token.value as string;
		const data = this.value.visit(scope);

		if (this.reassign && scope.symbolTable.get(name) == null) {
			RuntimeError.emit(`'${name}' is not defined`, 'This is undefined', this.start, this.token.end, scope);
		} else if (!this.reassign && scope.symbolTable.get(name) != null) {
			RuntimeError.emit(`Redeclaration of '${name}'`, "Omit 'var' to reassign this variable", this.start, this.end, scope);
		}

		scope.symbolTable.set(name, data);
		return data;
	}

	[inspect.custom]() {
		return `(${this.token[inspect.custom]()} = ${this.value[inspect.custom]()})`;
	}
}