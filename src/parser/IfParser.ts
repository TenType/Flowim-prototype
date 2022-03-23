import Parser from './Parser';
import { TT, KW } from '../constants';
import SyntaxError from '../logger/errors/SyntaxError';
import SyntaxWarning from '../logger/warnings/SyntaxWarning';

import { NodeReturn, NodeTypes } from '../tree/AST';
import IfNode from '../tree/control flow/IfNode';
import VarAssignNode from '../tree/VarAssignNode';

export default function parseIf(this: Parser) {

	const ifCases = (condition: NodeTypes, expr: boolean) => {
		const cases: [NodeReturn, NodeReturn][] = [];

		cases.push(ifBody(expr, condition));

		while (this.curr.isKW(KW.ELIF)) {
			const condition = ifCondition();

			if (expr) {
				this.expect(TT.KEYWORD, KW.THEN, `'${KW.IF}'`);
				// TODO: add hint for newline after then
				// if <condition then
				//				 ^^^^
				// end
			} else {
				this.expect(TT.DELIMIT, null, "newline or ';'");
			}

			cases.push(ifBody(expr, condition));
		}

		if (this.curr.isKW(KW.ELSE)) {
			if (!expr) {
				this.next();
				this.expect(TT.DELIMIT, null, "newline or ';'");
			}
			const elseCase = ifBody(expr)[1];
			if (!expr) {
				this.expect(TT.KEYWORD, KW.END);
				this.next();
			}
			return new IfNode(expr, cases, elseCase);
		}
		if (!expr) {
			this.expect(TT.KEYWORD, KW.END);
			this.next();
		}
		return new IfNode(expr, cases);
	};

	const ifCondition = () => {
		this.next();
		const condition = this.expr();
		if (condition instanceof VarAssignNode) {
			SyntaxWarning.emit('Variable assignment in condition', "Change '=' to an equality operator '=='", condition.start, condition.end);
		}
		return condition;
	};

	const ifBody = (expr: boolean, condition?: NodeTypes) => {
		this.next();
		let body: NodeTypes;
		if (expr) {
			body = this.statement();
		} else {
			body = this.statements(() => !this.curr.isKW(KW.ELIF) && !this.curr.isKW(KW.ELSE) && !this.curr.isKW(KW.END));
			// this.expect(TT.DELIMIT, null, "newline or ';'");
		}
		return [condition, body] as [NodeTypes, NodeTypes];
	};

	this.expect(TT.KEYWORD, KW.IF);
	const condition = ifCondition();

	if (this.curr.isKW(KW.THEN)) {
		return ifCases(condition, true);
	}
	if (this.curr.id == TT.DELIMIT) {
		return ifCases(condition, false);
		// SyntaxError.emit('TODO', 'TODO', this.curr.start, this.curr.end);
	}
	SyntaxError.emit("Expected 'then', newline, or ';'", "Expected 'then', newline, or ';' here", this.curr.start, this.curr.end);
}