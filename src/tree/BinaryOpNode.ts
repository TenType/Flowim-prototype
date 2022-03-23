import AST, { NodeReturn } from './AST';

import Token from '../Token';
import Position from '../Position';
import { KW, TT } from '../constants';
import { LiteralTypes, LiteralValue } from '../literals/BaseLiteral';
import IntLiteral from '../literals/IntLiteral';
import FloatLiteral from '../literals/FloatLiteral';
import RuntimeError from '../logger/errors/RuntimeError';
import TypeError from '../logger/errors/TypeError';

import { inspect } from 'util';
import Scope from '../context/Scope';
import TypeWarning from '../logger/warnings/TypeWarning';
import DeprecationWarning from '../logger/warnings/DeprecationWarning';
import StrLiteral from '../literals/StrLiteral';
import BoolLiteral from '../literals/BoolLiteral';

export default class BinaryOpNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(private left: NodeReturn, operator: Token, private right: NodeReturn) {
		super(operator);
		this.start = left.start;
		this.end = right.end;
	}

	public visit(scope: Scope): IntLiteral | FloatLiteral | StrLiteral | BoolLiteral {
		const left: LiteralTypes = this.left.visit(scope);
		const right: LiteralTypes = this.right.visit(scope);

		// console.assert(left instanceof ValueLiteral, 'BinaryOpNode is not ValueLiteral');
		// console.assert(right instanceof ValueLiteral, 'BinaryOpNode is not ValueLiteral');

		// Arithmetic operations
		if ([TT.ADD, TT.SUB, TT.MUL, TT.DIV, TT.POW, TT.MOD].includes(this.token.id)) {
			// check if types are either 'int' or 'float'
			if (!(left instanceof IntLiteral || left instanceof FloatLiteral) || !(right instanceof IntLiteral || right instanceof FloatLiteral)) {
				TypeError.emit("Arithmetic operations can only be used on types 'int' or 'float'", `Expected two types 'int' or 'float'; received types '${left.strRepr}' and '${right.strRepr}'`, this.start, this.end, scope);
			}

			const leftValue = left.value;
			const rightValue = right.value;
			let value: number;

			// perform arithmetic operation
			switch (this.token.id) {
				case TT.ADD: value = leftValue + rightValue; break;
				case TT.SUB: value = leftValue - rightValue; break;
				case TT.MUL: {
					// // String multiplication
					// if (left.isType('str') && right.isType('int')) {
					// 	return new ValueLiteral((left.value as string).repeat(rightValue), this.start, this.end, { type: 'str' }, scope);
					// }
					// if (left.isType('int') && right.isType('str')) {
					// 	return new ValueLiteral((right.value as string).repeat(leftValue), this.start, this.end, { type: 'str' }, scope);
					// }
					// // Numeric multiplication
					// if (!left.isType('number') || !right.isType('number')) {
					// 	new TypeError("Arithmetic operations can only be used on types 'int' or 'float', and string multiplication can only be used on types 'str' and 'int'", left.start, right.end, `Expected two types 'int' or 'float', or two types 'str' and 'int'; received types '${left.strRepr}' and '${right.strRepr}'`, scope);
					// }
					value = leftValue * rightValue; break;
				}
				case TT.DIV: {
					if (rightValue == 0) {
						RuntimeError.emit('Division by zero', 'This operation uses division by zero', this.start, this.end, scope);
					}
					value = leftValue / rightValue; break;
				}
				case TT.POW: value = leftValue ** rightValue; break;
				case TT.MOD: {
					if (rightValue == 0) {
						RuntimeError.emit('Modulo by zero', 'This operation uses modulo by zero', this.start, this.end, scope);
					}
					value = leftValue % rightValue; break;
				}
			}

			if (value % 1 == 0) {
				return new IntLiteral(value, null, this.start, this.end, scope);
			}
			return new FloatLiteral(value, null, this.start, this.end, scope);
		}

		if (this.token.id == TT.CONCAT) {
			if (!left.isType('str') || !right.isType('str')) {
				TypeError.emit("Concatenation can only be used on type 'str'", `Expected two types 'str'; received types '${left.strRepr}' and '${right.strRepr}'`, left.start, right.end, scope);
			}
			return new StrLiteral((left as StrLiteral).value + (right as StrLiteral).value, null, this.start, this.end, scope);
		}

		// Logical comparisons
		if ([TT.EQTO, TT.NEQTO, TT.LTHAN, TT.GTHAN, TT.LTHANEQ, TT.GTHANEQ, TT.KEYWORD].includes(this.token.id)) {
			let value: boolean;
			const leftValue = (left as LiteralValue).value;
			const rightValue = (right as LiteralValue).value;
			outer: switch (this.token.id) {
				// Comparisons
				case TT.EQTO: value = leftValue === rightValue; break;
				case TT.NEQTO: value = leftValue !== rightValue; break;
				case TT.LTHAN: value = leftValue < rightValue; break;
				case TT.GTHAN: value = leftValue > rightValue; break;
				case TT.LTHANEQ: value = leftValue <= rightValue; break;
				case TT.GTHANEQ: value = leftValue >= rightValue; break;

				// And / or
				case TT.KEYWORD: {
					// check if types are 'bool'
					if (!(left instanceof BoolLiteral) || !(right instanceof BoolLiteral)) {
						TypeError.emit(`Logical '${this.token.value}' comparison can only be used on types 'bool'`, `Expected two types 'bool', received types '${left.strRepr}' and '${right.strRepr}'`, this.start, this.end, scope);
					}

					switch (this.token.value) {
						case KW.OR: value = Boolean(leftValue || rightValue); break outer;
						case KW.AND: value = Boolean(leftValue && rightValue); break outer;
					}
				}
			}

			if (left.strRepr != right.strRepr) {
				TypeWarning.emit(`Comparison of different types '${left.strRepr}' and '${right.strRepr}' may result in unexpected behavior`, 'This may result in unexpected behavior', this.start, this.end, scope);
				DeprecationWarning.emit('Comparisons of different types are deprecated and will result in an error in the future');
			}
			return new BoolLiteral(value, null, this.start, this.end, scope);
		}
	}

	[inspect.custom](): string {
		return `(${this.left[inspect.custom]()}, ${this.token[inspect.custom]()}, ${this.right[inspect.custom]()})`;
	}
}