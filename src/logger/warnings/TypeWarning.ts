import BaseWarning, { WarnParam } from './BaseWarning';
import { Require } from '../../constants';
import Position from '../../Position';
import Scope from '../../context/Scope';

// type ParamType = Require<WarnParam, 'start' | 'end' | 'highlight'>;
export default class TypeWarning extends BaseWarning {
	public constructor(args: Require<WarnParam, 'start' | 'end' | 'highlight'>) {
		super(args, 'Type warning');
	}

	static emit(details: string, highlight: string, start: Position, end: Position, scope?: Scope) {
		super.emitWarn(new this({ details, highlight, start, end, scope }));
	}
}