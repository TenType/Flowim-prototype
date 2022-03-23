import AST, { NodeReturn } from '../AST';
import Token from '../../Token';
import Position from '../../Position';
import Scope from '../../context/Scope';
import TypeError from '../../logger/errors/TypeError';

import { inspect } from 'util';
import IntLiteral from '../../literals/IntLiteral';
import StatementsLiteral from '../../literals/StatementsLiteral';
import { LiteralTypes } from '../../literals/BaseLiteral';
import { BreakInterrupt } from './BreakNode';
import { ContinueInterrupt } from './ContinueNode';

export default class ForNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(
		private varName: Token,
		private forStart: NodeReturn,
		private forEnd: NodeReturn,
		private forStep: NodeReturn,
		private body: NodeReturn,
	) {
		super();
		this.start = varName.start;
		this.end = body.end;
	}

	public visit(scope: Scope) {
		const forStart = this.forStart.visit(scope);
		if (!(forStart instanceof IntLiteral)) {
			TypeError.emit("For loop start value must be type 'int'", `Expected type 'int', received type '${forStart.strRepr}'`, forStart.start, forStart.end, scope);
		}

		const forEnd = this.forEnd.visit(scope);
		if (!(forEnd instanceof IntLiteral)) {
			TypeError.emit("For loop end value must be type 'int'", `Expected type 'int', received type '${forEnd.strRepr}'`, forEnd.start, forEnd.end, scope);
		}

		let forStep: IntLiteral;
		if (this.forStep != null) {
			const forStepNode = this.forStep.visit(scope);
			if (!(forStepNode instanceof IntLiteral)) {
				TypeError.emit("For loop step value must be type 'int'", `Expected type 'int', received type ${forStepNode.strRepr}`, forStepNode.start, forStepNode.end, scope);
			}
			forStep = forStepNode;
		} else {
			forStep = new IntLiteral(1, null, this.forStart.start, this.forEnd.end, scope);
		}

		let i = forStart.value as number;

		const elements: LiteralTypes[] = [];
		for (i; forStep.value >= 0 ? i < forEnd.value : i > forEnd.value; i += forStep.value) {
			scope.symbolTable.set(this.varName.value as string, new IntLiteral(i, null, this.varName.start, this.varName.end, scope));

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
		return `for [${this.varName[inspect.custom]()} = ${this.forStart[inspect.custom]()}, ${this.forEnd[inspect.custom]()}, ${this.forStep?.[inspect.custom]()}]: ${this.body[inspect.custom]()}`;
	}
}