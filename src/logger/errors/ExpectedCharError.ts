import BaseError, { ErrorParam } from './BaseError';
import Position from '../../Position';
import { Require } from '../../constants';

// type ParamType = Require<ErrorParam, 'highlightText'>;
export default class ExpectedCharError extends BaseError {
	public constructor(args: Require<ErrorParam, 'highlight'>) {
		super(args, 'Unexpected character');
	}

	static emit(details: string, highlight: string, start: Position, end: Position): never {
		super.emitError(new this({ details, highlight, start, end }));
	}
}