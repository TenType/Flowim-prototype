import BaseWarning, { WarnParam } from './BaseWarning';
import { Optional } from '../../constants';
import Position from '../../Position';

// type ParamType = Optional<WarnParam, 'start' | 'end'>;
export default class DeprecationWarning extends BaseWarning {
	public constructor(args: Optional<WarnParam, 'start' | 'end'>) {
		super(args, 'Deprecation warning');
	}

	static emit(details: string, highlight?: string, start?: Position, end?: Position) {
		super.emitWarn(new this({ details, highlight, start, end }));
	}
}