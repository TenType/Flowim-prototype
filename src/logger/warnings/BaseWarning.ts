import Logger from '../Logger';
import Position from '../../Position';
import Scope from '../../context/Scope';

export interface WarnParam {
	details: string,
	start?: Position,
	end?: Position,
	highlight?: string,
	scope?: Scope,
}

export default abstract class BaseWarning extends Logger {
	constructor(
		{ details, start, end, highlight, scope }: WarnParam,
		name: string,
	) {
		super('warn', name, details, highlight, start, end, scope);
	}

	protected static emitWarn(warn: BaseWarning) {
		console.warn(warn.message);
	}
}