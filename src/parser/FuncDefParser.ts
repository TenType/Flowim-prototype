import Parser from './Parser';
import { TT, KW } from '../constants';
import Token from '../Token';
import FuncDefNode from '../tree/FuncDefNode';
import SyntaxError from '../logger/errors/SyntaxError';

export default function parseFuncDef(this: Parser) {
	this.expect(TT.KEYWORD, KW.FUNC, "'func'");
	this.next();

	let varName: Token;
	if (this.curr.id == TT.IDENTIFIER) {
		varName = this.curr;
		this.next();
		this.expect(TT.LPAREN, null, "'('");
	} else {
		this.expect(TT.LPAREN, null, "identifier or '('");
	}

	this.next();
	const args: Token[] = [];

	if (this.curr.id == TT.IDENTIFIER) {
		args.push(this.curr);
		this.next();
		while (this.curr.id as TT == TT.COMMA) {
			this.next();
			this.expect(TT.IDENTIFIER, null, 'identifier');
			args.push(this.curr);
			this.next();
		}

		this.expect(TT.RPAREN, null, "',' or ')'");
	} else {
		this.expect(TT.RPAREN, null, "identifier or ')'");
	}

	this.next();

	if (this.curr.id == TT.EQ) {
		this.next();
		return new FuncDefNode(varName, args, this.expr(), true);
	} else if (this.curr.id == TT.DELIMIT) {
		this.next();
		const body = this.statements(() => !this.curr.isKW(KW.END));
		this.expect(TT.KEYWORD, KW.END);
		this.next();
		return new FuncDefNode(varName, args, body, false);
	}

	SyntaxError.emit("Expected equal sign, newline, or ';'", "Expected equal sign, newline, or ';' here", this.curr.start, this.curr.end);
}