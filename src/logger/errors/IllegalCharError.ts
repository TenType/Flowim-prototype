import BaseError, { ErrorParam } from './BaseError';
import Position from '../../Position';

// type ParamType = ErrorParam;
export default class IllegalCharError extends BaseError {
	public constructor(args: ErrorParam) {
		super(args, 'Illegal character');
	}

	static emit(details: string, highlight: string, start: Position, end: Position): never {
		return super.emitError(new this({ details, highlight, start, end }));
	}
}