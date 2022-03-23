import AST, { NodeReturn } from './AST';
import Position from '../Position';
import Scope from '../context/Scope';

import { inspect } from 'util';
import { LiteralTypes } from '../literals/BaseLiteral';
import StatementsLiteral from '../literals/StatementsLiteral';

export default class StatementsNode extends AST {
	public constructor(private nodes: NodeReturn[], public start: Position, public end: Position) {
		super();
	}

	public visit(scope: Scope) {
		const elements: LiteralTypes[] = [];
		for (let i = 0; i < this.nodes.length; i++) {
			elements.push(this.nodes[i].visit(scope));
		}
		return new StatementsLiteral(elements, null, this.start, this.end, scope);
	}

	[inspect.custom]() {
		return `statements: ${inspect(this.nodes, false, null, true)}`;
	}
}