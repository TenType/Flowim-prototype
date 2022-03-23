import RuntimeError from './RuntimeError';
import Position from '../../Position';
import Scope from '../../context/Scope';

export default class InvalidInterruptError extends RuntimeError {
	public constructor(details: string, highlight: string, start: Position, end: Position, scope: Scope) {
		super({
			details: "'break' can only be used in a loop or iteration",
			highlight: 'Invalid break statement here',
			start, end, scope,
		});
	}
}