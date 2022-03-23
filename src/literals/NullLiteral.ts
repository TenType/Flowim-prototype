import BaseLiteral, { StrReprTypes } from './BaseLiteral';
import Position from '../Position';
import Scope from '../context/Scope';
import { DEBUG } from '../constants';

import { inspect } from 'util';

export default class NullLiteral extends BaseLiteral {
	public strRepr = 'null' as const;

	public constructor(
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
		return new NullLiteral(this.annotations, this.start, this.end, this.scope);
	}

	[inspect.custom]() {
		return `<${this.strRepr}>`;
	}
}