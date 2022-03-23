import BaseLiteral, { LiteralTypes, StrReprTypes } from './BaseLiteral';
import Position from '../Position';
import Scope from '../context/Scope';

import { inspect } from 'util';
import NullLiteral from './NullLiteral';

export default class StatementsLiteral extends BaseLiteral {
	public strRepr = 'statements' as const;

	public constructor(
		public value: LiteralTypes[],
		public annotations?: null,
		start?: Position,
		end?: Position,
		scope?: Scope,
	) {
		super(start, end, scope);
	}

	public isType(type: StrReprTypes | 'number') {
		return false;
	}

	public copy() {
		return new StatementsLiteral(this.value, this.annotations, this.start, this.end, this.scope);
	}

	[inspect.custom]() {
		let result = '';
		for (let i = 0; i < this.value.length; i++) {
			const value = this.value[i];
			if (!(value instanceof NullLiteral)) {
				result += value[inspect.custom]();
				if (i < this.value.length - 1) result += '\n';
			}
		}
		return result;
	}
}