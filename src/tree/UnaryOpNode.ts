import AST, { NodeReturn } from './AST';
import Token from '../Token';
import Position from '../Position';

import { inspect } from 'util';
import { KW, TT } from '../constants';
import Scope from '../context/Scope';
import TypeError from '../logger/errors/TypeError';
import { LiteralTypes } from '../literals/BaseLiteral';
import BoolLiteral from '../literals/BoolLiteral';
import IntLiteral from '../literals/IntLiteral';
import FloatLiteral from '../literals/FloatLiteral';

export default class UnaryOpNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(operator: Token, private node: NodeReturn) {
		super(operator);
		this.start = this.token.start;
		this.end = node.end;
	}

	public visit(scope: Scope): LiteralTypes {
		const node = this.node.visit(scope) as LiteralTypes;
		if (this.token.id == TT.SUB) {
			if (!(node instanceof IntLiteral) && !(node instanceof FloatLiteral)) {
				TypeError.emit(`Type '${node.strRepr}' can not be negated`, `Expected type 'int' or 'float', received type '${node.strRepr}'`, node.start, node.end, scope);
			}
			node.value *= -1;
		} else if (this.token.isKW(KW.NOT)) {
			if (!(node instanceof BoolLiteral)) {
				TypeError.emit(`Type '${node.strRepr}' can not be inversed`, `Expected type 'bool', received type '${node.strRepr}'`, node.start, node.end, scope);
			}
			node.value = !node.value;
		}
		return node;
	}

	[inspect.custom](): string {
		return `(${this.token[inspect.custom]()}, ${this.node[inspect.custom]()})`;
	}
}