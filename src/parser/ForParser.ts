import Parser from './Parser';
import { TT, KW } from '../constants';
import { NodeReturn } from '../tree/AST';
import ForNode from '../tree/control flow/ForNode';
import SyntaxError from '../logger/errors/SyntaxError';

export default function parseFor(this: Parser) {
	this.expect(TT.KEYWORD, KW.FOR, `'${KW.FOR}'`);
	this.next();

	this.expect(TT.IDENTIFIER, null, 'identifier');
	const varName = this.curr;
	this.next();

	this.expect(TT.EQ, null, "'='");
	this.next();

	const forStart = this.expr();

	this.expect(TT.COMMA, null, "','");
	this.next();

	const forEnd = this.expr();

	let forStep: NodeReturn;
	if (this.curr.id == TT.COMMA) {
		this.next();
		forStep = this.expr();
	}

	if (this.curr.id == TT.DELIMIT) {
		this.next();
		const body = this.statements(() => !this.curr.isKW(KW.END));
		this.expect(TT.KEYWORD, KW.END);
		this.next();
		return new ForNode(varName, forStart, forEnd, forStep, body);
	}

	// this.expect(TT.DELIMIT, null, "newline or ';'");
	// this.next();

	if (this.curr.isKW(KW.DO)) {
		this.next();
		const body = this.statement();
		return new ForNode(varName, forStart, forEnd, forStep, body);
	}
	SyntaxError.emit("Expected 'do', newline, or ';'", "Expected 'do', newline, or ';' here", this.curr.start, this.curr.end);

}
