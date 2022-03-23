import { NodeReturn } from '../tree/AST';
import { TT } from '../constants';

import Parser from './Parser';
import ListNode from '../tree/ListNode';

export default function parseList(this: Parser) {
	const elements: NodeReturn[] = [];
	const start = this.curr.start;

	this.expect(TT.LSQUARE, null, '[');
	this.next();

	if (this.curr.id != TT.RSQUARE) {
		elements.push(this.expr());
		while (this.curr.id == TT.COMMA) {
			this.next();
			elements.push(this.expr());
		}
		this.expect(TT.RSQUARE, null, "',' or ']'");
	}
	this.next();
	return new ListNode(elements, start, this.curr.end.copy());
}