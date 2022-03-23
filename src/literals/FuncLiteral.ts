import Scope from '../context/Scope';
import RuntimeError from '../logger/errors/RuntimeError';
import { NodeReturn } from '../tree/AST';
import Position from '../Position';
import SymbolTable from '../context/SymbolTable';
import BaseLiteral, { LiteralTypes, StrReprTypes } from './BaseLiteral';
import NullLiteral from './NullLiteral';
import { ReturnInterrupt } from '../tree/control flow/ReturnNode';
import { DEBUG } from '../constants';

import { inspect } from 'util';

type BuiltInBody = (context: { start: Position, end: Position, scope: Scope }, args: { [key: string]: LiteralTypes }) => LiteralTypes | void;

export default class FuncLiteral extends BaseLiteral {
	public strRepr = 'func' as const;

	public constructor(public name = '<anonymous>', private argNames: string[], private body: NodeReturn | BuiltInBody, private expr = false, start?: Position, end?: Position, scope?: Scope) {
		super(start, end, scope);
	}

	public execute(args: LiteralTypes[]) {
		const execScope = new Scope(this.name, this.scope, this.start);
		execScope.symbolTable = new SymbolTable(execScope.parent.symbolTable);

		if (args.length != this.argNames.length) {
			RuntimeError.emit('Invalid number of arguments passed in function', `Expected ${this.argNames.length} argument(s), received ${args.length}`, this.start, this.end, this.scope);
		}

		for (let i = 0; i < args.length; i++) {
			const argName = this.argNames[i];
			const argValue = args[i];
			argValue.scope = this.scope;
			execScope.symbolTable.set(argName, argValue);
		}

		if ('visit' in this.body) {
			try {
				const result = this.body.visit(execScope);
				if (result == null || !this.expr) return new NullLiteral(null, this.start, this.end, this.scope);
				return result as LiteralTypes;
			} catch (error) {
				if (error instanceof ReturnInterrupt) {
					return error.value as LiteralTypes;
				} else {
					throw error;
				}
			}
		} else {
			const result = this.body({ start: this.start, end: this.end, scope: this.scope }, Object.fromEntries(execScope.symbolTable.symbols));
			if (result == null) {
				return new NullLiteral(null, this.start, this.end, this.scope);
			}
			return result as LiteralTypes;
		}
	}

	public copy() {
		return new FuncLiteral(this.name, this.argNames, this.body, this.expr, this.start, this.end, this.scope);
	}

	public isType(type: StrReprTypes | 'number') {
		return type == 'func';
	}

	[inspect.custom]() {
		if (DEBUG) return `${this.name}<${this.strRepr}>`;
		return `${this.name}`;
	}
}