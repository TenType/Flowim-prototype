import AST, { NodeReturn } from './AST';
import Position from '../Position';
import Scope from '../context/Scope';

import { inspect } from 'util';
import { LiteralTypes } from '../literals/BaseLiteral';
import ListLiteral from '../literals/ListLiteral';

export default class ListNode extends AST {
	public constructor(private nodes: NodeReturn[], public start: Position, public end: Position) {
		super();
	}

	public visit(scope: Scope) {
		const elements: LiteralTypes[] = [];
		for (let i = 0; i < this.nodes.length; i++) {
			elements.push(this.nodes[i].visit(scope));
		}
		return new ListLiteral(elements, null, this.start, this.end, scope);
	}

	[inspect.custom]() {
		return `list: ${inspect(this.nodes, false, null, true)}`;
	}
}