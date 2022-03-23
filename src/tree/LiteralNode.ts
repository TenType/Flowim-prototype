import AST from './AST';
import Token from '../Token';
import Position from '../Position';

import { inspect } from 'util';
import Scope from '../context/Scope';
import { TT } from '../constants';
import IntLiteral from '../literals/IntLiteral';
import FloatLiteral from '../literals/FloatLiteral';
import BoolLiteral from '../literals/BoolLiteral';
import StrLiteral from '../literals/StrLiteral';
import { LiteralTypes } from '../literals/BaseLiteral';

export default class LiteralNode extends AST {
	public start: Position;
	public end: Position;

	public constructor(token: Token) {
		super(token);
		this.start = token.start;
		this.end = token.end;
	}

	public visit(scope: Scope): LiteralTypes {
		switch (this.token.id) {
			case TT.INT:
				return new IntLiteral(this.token.value as number, null, this.start, this.end, scope);

			case TT.FLOAT:
				return new FloatLiteral(this.token.value as number, null, this.start, this.end, scope);

			case TT.BOOL:
				return new BoolLiteral(this.token.value as boolean, null, this.start, this.end, scope);

			case TT.STR:
				return new StrLiteral(this.token.value as string, null, this.start, this.end, scope);
		}
	}

	[inspect.custom]() {
		return `${this.token[inspect.custom]()}`;
	}
}