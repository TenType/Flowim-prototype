import AST, { NodeReturn } from '../AST';
import Position from '../../Position';
import Scope from '../../context/Scope';

import { inspect } from 'util';
import StatementsLiteral from '../../literals/StatementsLiteral';
import { LiteralValue, LiteralTypes } from '../../literals/BaseLiteral';
import { BreakInterrupt } from './BreakNode';
import { ContinueInterrupt } from './ContinueNode';

export default class WhileNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(
		private condition: NodeReturn,
		private body: NodeReturn,
	) {
		super();
		this.start = condition.start;
		this.end = body.end;
	}

	public visit(scope: Scope) {
		const elements: LiteralTypes[] = [];
		while ((this.condition.visit(scope) as LiteralValue).value == true) {
			try {
				elements.push(this.body.visit(scope));
			} catch (error) {
				if (error instanceof BreakInterrupt) break;
				if (error instanceof ContinueInterrupt) continue;
				throw error;
			}
		}
		return new StatementsLiteral(elements, null, this.start, this.end, scope);
	}

	[inspect.custom](): string {
		return `while ${this.condition[inspect.custom]()}: ${this.body[inspect.custom]()}`;
	}
}