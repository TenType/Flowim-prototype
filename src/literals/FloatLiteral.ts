import BaseLiteral, { StrReprTypes } from './BaseLiteral';
import Position from '../Position';
import Scope from '../context/Scope';
import { DEBUG } from '../constants';

import { inspect } from 'util';

export default class FloatLiteral extends BaseLiteral {
	public strRepr = 'float' as const;

	public constructor(
		public value: number,
		public annotations?: null,
		start?: Position,
		end?: Position,
		scope?: Scope,
	) {
		super(start, end, scope);
	}

	public isType(type: StrReprTypes | 'number') {
		if (type == 'number' || type == this.strRepr) return true;
		return false;
	}

	public copy() {
		return new FloatLiteral(this.value, this.annotations, this.start, this.end, this.scope);
	}

	[inspect.custom]() {
		if (DEBUG) return `${this.value}<${this.strRepr}>`;
		return `${this.value}`;
	}
}