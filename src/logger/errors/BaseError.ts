import Logger from '../Logger';
import Position from '../../Position';
import Scope from '../../context/Scope';

export interface ErrorParam {
	details: string,
	highlight: string,
	start: Position,
	end: Position,
	scope?: Scope,
}

export default abstract class BaseError extends Logger {
	constructor(
		{ details, highlight, start, end, scope }: ErrorParam,
		name: string,
	) {
		super('error', name, details, highlight, start, end, scope);
	}

	protected static emitError(error: BaseError): never {
		throw error;
	}
}