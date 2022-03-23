import Position from './Position';
import { KW, TT } from './constants';

import { inspect } from 'util';

export default class Token {
	public constructor(
		public id: TT,
		public value: string | number | boolean,
		public start: Position,
		public end?: Position,
	) {
		this.start = this.start.copy();
		if (this.end == null) {
			this.end = this.start.copy();
		} else {
			this.end = this.end.copy();
		}
	}

	public isKW(value: KW) {
		return this.id === TT.KEYWORD && this.value === value;
	}

	[inspect.custom]() {
		if (this.value != null) {
			return `${this.id}:${this.value}`;
		}
		return `${this.id}`;
	}
}