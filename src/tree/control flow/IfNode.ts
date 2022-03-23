import AST, { NodeReturn } from '../AST';
import Position from '../../Position';
import Scope from '../../context/Scope';

import { inspect } from 'util';
import { LiteralTypes, LiteralValue } from '../../literals/BaseLiteral';
import RuntimeError from '../../logger/errors/RuntimeError';
import NullLiteral from '../../literals/NullLiteral';

export default class IfNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(private expr: boolean, private cases: [NodeReturn, NodeReturn][], private elseCase?: NodeReturn) {
		super();
		this.start = cases[0][0].start;
		this.end = (elseCase ?? cases.at(-1)[0]).end;
	}

	public visit(scope: Scope): LiteralTypes {
		for (let i = 0; i < this.cases.length; i++) {
			const conditionRes = this.cases[i][0].visit(scope) as LiteralValue;
			if (conditionRes.value == true) {
				const result = this.cases[i][1].visit(scope);
				return this.expr ? result : new NullLiteral();
			}
		}
		if (this.elseCase != null) {
			const elseRes = this.elseCase.visit(scope);
			return this.expr ? elseRes : new NullLiteral();
		}
		return new NullLiteral();
	}

	[inspect.custom](): string {
		if (this.elseCase != null) {
			return `(IF:${inspect(this.cases, false, null, true)}, ELSE:${this.elseCase[inspect.custom]()})`;
		}
		return `IF:${inspect(this.cases, false, null, true)}`;
	}
}