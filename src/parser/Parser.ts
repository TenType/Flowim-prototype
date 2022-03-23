import Token from '../Token';
import SyntaxError from '../logger/errors/SyntaxError';
import { KW, TT } from '../constants';

import { NodeReturn, NodeTypes } from '../tree/AST';
import LiteralNode from '../tree/LiteralNode';
import BinaryOpNode from '../tree/BinaryOpNode';
import UnaryOpNode from '../tree/UnaryOpNode';
import VarAccessNode from '../tree/VarAccessNode';
import VarAssignNode from '../tree/VarAssignNode';
import FuncCallNode from '../tree/FuncCallNode';
import ReturnNode from '../tree/control flow/ReturnNode';
import BreakNode from '../tree/control flow/BreakNode';
import ContinueNode from '../tree/control flow/ContinueNode';
import StatementsNode from '../tree/StatementsNode';

import ifImport from './IfParser';
import forImport from './ForParser';
import whileImport from './WhileParser';
import funcDefImport from './FuncDefParser';
import listImport from './ListParser';

export default class Parser {
	protected curr: Token;

	private parseIf = ifImport;
	private parseFor = forImport;
	private parseWhile = whileImport;
	private parseFuncDef = funcDefImport;
	private parseList = listImport;

	/**
	 * | Tier | Operation                              |
	 * | :--- | :------------------------------------- |
	 * | `0`  | Unary operation / Number / Parentheses |
	 * | `1`  | Pow                                    |
	 * | `2`  | Multiply / Divide / Modulus            |
	 * | `3`  | Add / Subtract                         |
	 * | `4`  | == / != / < / > / <= / >=              |
	 * | `5`  | And / or comparison                    |
	 * | `6`  | Not comparison                         |
	 * | `7`  | Variables                              |
	 */
	// private readonly PRECEDENCE: [(...args: any[]) => NodeReturn | NodeTypes, [TT[] | string[]]? ][] = [
	// 	[this.treeTip],
	// 	[this.funcCall],
	// 	[this.unaryOp],
	// 	[this.arithBinaryOp, [[TT.POW]]],
	// 	[this.arithBinaryOp, [[TT.MUL, TT.DIV, TT.MOD]]],
	// 	[this.arithBinaryOp, [[TT.ADD, TT.SUB, TT.CONCAT]]],
	// 	[this.arithBinaryOp, [[TT.EQTO, TT.NEQTO, TT.LTHAN, TT.GTHAN, TT.LTHANEQ, TT.GTHANEQ]]],
	// 	[this.compBinaryOp, [[KW.OR, KW.AND]]],
	// 	[this.compExpr],
	// 	[this.varAssign],
	// ];

	// private readonly PRIORITY = new Map<TT | KW, number>([
	// 	[KW.OR, 10],
	// 	[KW.AND, 10],
	// 	[TT.EQTO, 20],
	// 	[TT.NEQTO, 20],
	// 	[TT.LTHAN, 20],
	// 	[TT.GTHAN, 20],
	// 	[TT.LTHANEQ, 20],
	// 	[TT.GTHANEQ, 20],
	// 	[TT.ADD, 30],
	// 	[TT.SUB, 30],
	// 	[TT.MUL, 40],
	// 	[TT.DIV, 40],
	// 	[TT.MOD, 40],
	// 	[TT.POW, 50],
	// ]);

	public constructor(private tokens: Token[], private index = -1) {
		this.next();
	}

	protected next() {
		this.index += 1;
		if (this.index < this.tokens.length) {
			this.curr = this.tokens[this.index];
		}
		return this.curr;
	}

	public run() {
		const result = this.statements();
		if (this.curr.id != TT.EOF) {
			// console.debug('\tdebug: (TOKENS)\n', this.tokens);
			// console.debug('\tdebug: (AST)\n', result);
			// console.debug('\tdebug: (CURR)\n', this.curr);
			SyntaxError.emit('Unexpected end of statement while parsing', "Incomplete statement or missing newline or ';' here", this.curr.start, this.curr.end);
		}
		return result;
	}

	protected expect(id: TT, value: string | null, char = value != null ? `'${value}'` : `'${id}'`, highlight = `Expected ${char} here`) {
		if (this.curr.id != id || (this.curr.value != value && value != null)) {
			if (id == TT.IDENTIFIER && this.curr.id == TT.KEYWORD) {
				SyntaxError.emit(`Expected ${char}`, 'Reserved words are not allowed as identifiers', this.curr.start, this.curr.end);
			}
			SyntaxError.emit(`Expected ${char}`, highlight, this.curr.start, this.curr.end);
		}
	}

	protected statements(blockDelimit?: () => boolean) {
		const statements: NodeTypes[] = [];
		const start = this.curr.start.copy();

		const parseUntil = () => blockDelimit ? this.curr.id != TT.EOF && blockDelimit() : this.curr.id != TT.EOF;

		while (parseUntil()) {
			while (this.curr.id as TT == TT.DELIMIT) {
				this.next();
			}
			const statement = this.statement();
			statements.push(statement);
			this.next();
		}

		return new StatementsNode(statements, start, this.curr.end.copy());
	}

	protected statement() {
		const start = this.curr.start.copy();

		if (this.curr.isKW(KW.RETURN)) {
			const end = this.curr.end.copy();
			this.next();
			const expr = this.expr();
			return new ReturnNode(expr, start, end);

		} else if (this.curr.isKW(KW.CONTINUE)) {
			const end = this.curr.end.copy();
			this.next();
			return new ContinueNode(start, end);

		} else if (this.curr.isKW(KW.BREAK)) {
			const end = this.curr.end.copy();
			this.next();
			return new BreakNode(start, end);
		}
		return this.expr();
	}

	protected expr(): NodeTypes {
		if (this.curr.isKW(KW.VAR)) {
			this.next();
			this.expect(TT.IDENTIFIER, null, 'identifier');

			const name = this.curr;
			this.next();
			this.expect(TT.EQ, null, "'='");

			this.next();
			const node = this.expr() as VarAssignNode;
			return new VarAssignNode(name, node, false);
		}
		const expr = this.compKeyword();

		if (this.curr.id == TT.EQ) {
			this.next();
			if (expr instanceof VarAccessNode) {
				return new VarAssignNode(expr.token, this.expr(), true);
			}
			SyntaxError.emit('Invalid assignment target', 'Expected an identifier here', expr.start, expr.end);
		}
		return expr;
	}

	// private binaryOp(tier: number, exprPriority = 0, left: NodeTypes) {
	// 	// let result = this.createNodes(tier - 1);
	// 	while (true) {
	// 		const currPriority = this.curr.id == TT.KEYWORD ? this.PRIORITY.get(this.curr.value as KW) : this.PRIORITY.get(this.curr.id);
	// 		if (currPriority < exprPriority) {
	// 			return left;
	// 		}
	// 		const operator = this.curr;
	// 		this.next();
	// 		let right = this.createNodes(tier - 1);
	// 		const nextPriority = this.curr.id == TT.KEYWORD ? this.PRIORITY.get(this.curr.value as KW) : this.PRIORITY.get(this.curr.id);

	// 		if (currPriority < nextPriority) {
	// 			right = this.binaryOp(tier, currPriority + 1, right);
	// 		}

	// 		left = new BinaryOpNode(left, operator, right);
	// 	}
	// }

	// ************************************************** //

	private arithBinaryOp(func: () => NodeTypes, check: TT[]) {
		let result = func();

		while (check.includes(this.curr.id)) {
			const operator = this.curr;
			this.next();
			result = new BinaryOpNode(result, operator, func());
		}

		return result;
	}

	private compBinaryOp(func: () => NodeTypes, check: string[]) {
		let result = func();

		while (this.curr.id == TT.KEYWORD && check.includes(this.curr.value as string)) {
			const operator = this.curr;
			this.next();
			result = new BinaryOpNode(result, operator, func());
		}

		return result;
	}

	// ************************************************** //

	private compKeyword = (): NodeReturn => {
		if (this.curr.isKW(KW.NOT)) {
			const token = this.curr;
			this.next();
			const node = this.compKeyword();
			return new UnaryOpNode(token, node);
		}
		return this.compBinaryOp(this.compExpr, [KW.OR, KW.AND]);
	};

	private compExpr = () => {
		return this.arithBinaryOp(this.additiveExpr, [TT.EQTO, TT.NEQTO, TT.LTHAN, TT.GTHAN, TT.LTHANEQ, TT.GTHANEQ]);
	};

	private additiveExpr = () => {
		return this.arithBinaryOp(this.multiplyExpr, [TT.ADD, TT.SUB, TT.CONCAT]);
	};

	private multiplyExpr = () => {
		return this.arithBinaryOp(this.unaryOp, [TT.MUL, TT.DIV]);
	};

	private unaryOp = (): NodeReturn => {
		// Unary operation (ex: -1)
		if (this.curr.id == TT.ADD || this.curr.id == TT.SUB) {
			const token = this.curr;
			this.next();
			const operand = this.expr();
			return new UnaryOpNode(token, operand);
		}
		return this.powExpr();

	};

	private powExpr = () => {
		return this.arithBinaryOp(this.funcCall, [TT.POW]);
	};

	private funcCall = () => {
		const expr = this.treeTip();

		if (this.curr.id == TT.LPAREN) {
			const args: NodeReturn[] = [];
			this.next();

			if (this.curr.id as TT != TT.RPAREN) {
				args.push(this.expr());
				while (this.curr.id as TT == TT.COMMA) {
					this.next();
					args.push(this.expr());
				}
				this.expect(TT.RPAREN, null, "',' or ')'");
			}
			this.next();
			return new FuncCallNode(expr, args);
		}
		return expr;
	};

	private treeTip = (): NodeTypes => {
		const token = this.curr;

		// Literal
		if ([TT.INT, TT.FLOAT, TT.BOOL, TT.STR].includes(this.curr.id)) {
			this.next();
			return new LiteralNode(token);
		}

		// Identifier
		if (token.id == TT.IDENTIFIER) {
			this.next();
			return new VarAccessNode(token);
		}

		// Parenthesis
		if (token.id == TT.LPAREN) {
			this.next();
			const expression = this.expr();
			this.expect(TT.RPAREN, null, "')'");
			this.next();
			return expression;
		}

		if (token.id == TT.LSQUARE) {
			return this.parseList();
		}

		if (token.id == TT.KEYWORD) {
			switch (token.value) {
				case KW.IF: return this.parseIf();
				case KW.FOR: return this.parseFor();
				case KW.WHILE: return this.parseWhile();
				case KW.FUNC: return this.parseFuncDef();
			}
		}

		// Invalid syntax
		if (token.id == TT.KEYWORD) {
			SyntaxError.emit("Expected a valid operator, identifier, literal, or '('", 'Unexpected token here', this.curr.start, this.curr.end);
		}
		// console.debug('\tdebug: (CURR)\n', this.curr);
		SyntaxError.emit("Expected a valid keyword, operator, identifier, literal, or '('", 'Unexpected token here', this.curr.start, this.curr.end);
	};
}