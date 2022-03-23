import AST, { NodeReturn } from './AST';
import Position from '../Position';
import Scope from '../context/Scope';

import { inspect } from 'util';
import Token from '../Token';
import FuncLiteral from '../literals/FuncLiteral';

export default class FuncDefNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(private funcName: Token | null, private args: Token[], private body: NodeReturn, private expr: boolean) {
		super();
		if (funcName != null) {
			this.start = funcName.start;
		} else if (args.length > 0) {
			this.start = args[0].start;
		} else {
			this.start = body.start;
		}
		this.end = body.end;
	}

	public visit(scope: Scope) {
		const argNames = this.args.map(arg => arg.value);
		const funcValue = new FuncLiteral(this.funcName?.value as string, argNames as string[], this.body, this.expr, this.start, this.end, scope);

		if (this.funcName != null) {
			scope.symbolTable.set(this.funcName.value as string, funcValue);
		}
		return funcValue;
	}

	[inspect.custom]() {
		return `funcDef: (${this.funcName?.[inspect.custom]()}, ${inspect(this.args, false, null, true)}, ${inspect(this.body, false, null, true)})`;
	}
}