import BaseError, { ErrorParam } from './BaseError';
import Position from '../../Position';

// type ParamType = ErrorParam;
export default class SyntaxError extends BaseError {
	public constructor(args: ErrorParam) {
		super(args, 'Invalid syntax');
	}

	static emit(details: string, highlight: string, start: Position, end: Position): never {
		super.emitError(new this({ details, highlight, start, end }));
	}
}