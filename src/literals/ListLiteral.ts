import BaseLiteral, { LiteralTypes, StrReprTypes } from './BaseLiteral';
import Position from '../Position';
import Scope from '../context/Scope';
import { DEBUG } from '../constants';

import { inspect } from 'util';

export default class ListLiteral extends BaseLiteral {
	public strRepr = 'list' as const;

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
		if (type == this.strRepr) return true;
		return false;
	}

	public copy() {
		return new ListLiteral(this.value, this.annotations, this.start, this.end, this.scope);
	}

	[inspect.custom]() {
		if (DEBUG) return `${inspect(this.value, false, null, true)}<${this.strRepr}>`;
		return `${inspect(this.value, false, null, true)}`;
	}
}