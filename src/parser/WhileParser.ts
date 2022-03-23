import Parser from './Parser';
import { TT, KW } from '../constants';
import SyntaxError from '../logger/errors/SyntaxError';
import SyntaxWarning from '../logger/warnings/SyntaxWarning';
import VarAssignNode from '../tree/VarAssignNode';
import WhileNode from '../tree/control flow/WhileNode';

export default function parseWhile(this: Parser) {
	this.expect(TT.KEYWORD, KW.WHILE, `'${KW.WHILE}'`);
	this.next();

	const condition = this.expr();
	if (condition instanceof VarAssignNode) {
		SyntaxWarning.emit('Variable assignment in condition', "Change '=' to an equality operator '=='", condition.start, this.curr.end);
	}

	// this.expect(TT.DELIMIT, null, "newline or ';'");
	// this.next();

	if (this.curr.id == TT.DELIMIT) {
		this.next();
		const body = this.statements(() => !this.curr.isKW(KW.END));
		this.expect(TT.KEYWORD, KW.END);
		this.next();
		return new WhileNode(condition, body);
	}

	if (this.curr.isKW(KW.DO)) {
		this.next();
		const body = this.statement();
		return new WhileNode(condition, body);
	}

	SyntaxError.emit("Expected 'do', newline, or ';'", "Expected 'do', newline, or ';' here", this.curr.start, this.curr.end);
}