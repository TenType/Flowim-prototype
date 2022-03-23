import BaseError, { ErrorParam } from './BaseError';
import Position from '../../Position';
import { Require } from '../../constants';
import Scope from '../../context/Scope';

// type ParamType = Require<ErrorParam, 'highlightText' | 'scope'>;
export default class TypeError extends BaseError {
	public constructor(args: Require<ErrorParam, 'highlight' | 'scope'>) {
		super(args, 'Type error');
	}

	static emit(details: string, highlight: string, start: Position, end: Position, scope: Scope): never {
		super.emitError(new this({ details, highlight, start, end, scope }));
	}
}