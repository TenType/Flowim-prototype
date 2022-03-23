import Token from './Token';
import IllegalCharError from './logger/errors/IllegalCharError';
import ExpectedCharError from './logger/errors/ExpectedCharError';
import Position from './Position';
import { TT, KW, LETTERS, LETTERS_NUMS, DIGITS, PARENTHESES, OPERATORS, COMPARISONS, ESCAPE_CHARS } from './constants';
import SyntaxError from './logger/errors/SyntaxError';

export default class Lexer {
	private curr: string;
	private pos: Position;

	public constructor(fileName: string, private code: string) {
		this.code = code.replaceAll('\t', '    ');
		this.pos = new Position(-1, 0, -1, fileName, this.code);
		this.next();
	}

	public run() {
		const tokens: Token[] = [];
		while (this.curr !== undefined) {
			if (this.curr == ' ') {
				// Skip whitespace
			} else if (this.curr == '-' && this.peek() == '-') {
				this.skipComment();
			} else if (this.curr == '/' && this.peek() == '-') {
				this.skipMultiComment();
			} else if (this.curr == '\n' || this.curr == ';') {
				tokens.push(new Token(TT.DELIMIT, null, this.pos));
			} else if (this.curr == ',') {
				tokens.push(new Token(TT.COMMA, null, this.pos));
			} else if (this.curr == "'" || this.curr == '"') {
				tokens.push(this.makeString());
			} else if (DIGITS.includes(this.curr)) {
				tokens.push(this.makeNumber());
			} else if (OPERATORS.includes(this.curr)) {
				tokens.push(this.makeOperator());
			} else if (LETTERS.test(this.curr)) {
				tokens.push(this.makeIdentifier());
			} else if (PARENTHESES.includes(this.curr)) {
				tokens.push(this.makeParenthesis());
			} else if (COMPARISONS.includes(this.curr)) {
				tokens.push(this.makeComparison());
			} else {
				IllegalCharError.emit(`'${this.curr}' is not a valid character`, 'Illegal character here', this.pos, this.pos);
			}
			this.next();
		}
		tokens.push(new Token(TT.EOF, null, this.pos));
		return tokens;
	}

	private peek() {
		return this.code[this.pos.index + 1];
	}

	private next() {
		this.pos.next(this.curr);
		this.curr = this.code[this.pos.index];
		return this.curr;
	}

	private back() {
		this.pos.back(this.code[this.pos.index - 1]);
		this.curr = this.code[this.pos.index];
		return this.curr;
	}

	private makeNumber() {
		let num = '';
		let dotCount = 0;
		const start = this.pos.copy();
		while (DIGITS.includes(this.curr) || this.curr == '.') {
			if (this.curr == '.') {
				if (dotCount > 0) break;
				dotCount++;
			}
			num += this.curr;
			this.next();
		}
		this.back();

		if (dotCount == 0) {
			return new Token(TT.INT, Number(num), start, this.pos);
		}
		return new Token(TT.FLOAT, Number(num), start, this.pos);
	}

	private makeParenthesis() {
		let id: TT;
		switch (this.curr) {
			case '(': id = TT.LPAREN; break;
			case ')': id = TT.RPAREN; break;
			case '[': id = TT.LSQUARE; break;
			case ']': id = TT.RSQUARE; break;
		}
		return new Token(id, null, this.pos);
	}

	private makeOperator() {
		let id: TT;
		switch (this.curr) {
			case '+': id = TT.ADD; break;
			case '-': id = TT.SUB; break;
			case '*': id = TT.MUL; break;
			case '/': id = TT.DIV; break;
			case '^': id = TT.POW; break;
			case '%': id = TT.MOD; break;
			case '&': id = TT.CONCAT; break;
			default: new Error('Operator not caught');
		}
		return new Token(id, null, this.pos);
	}

	private makeString() {
		let str = '';
		let escape = false;

		const char = this.curr;
		const start = this.pos.copy();
		this.next();

		while (this.curr != char || escape) {
			if (this.curr == null || this.curr == '\n') {
				SyntaxError.emit(`Expected ${char}`, `Missing ${char} here`, this.pos, this.pos);
			}
			if (escape) {
				str += ESCAPE_CHARS[this.curr] ?? this.curr;
				escape = false;
			} else if (this.curr == '\\') {
				escape = true;
			} else {
				str += this.curr;
			}
			this.next();
		}
		return new Token(TT.STR, str, start, this.pos);
	}

	private makeIdentifier() {
		let str = '';
		const start = this.pos.copy();
		while (LETTERS_NUMS.test(this.curr) && this.curr != null) {
			str += this.curr;
			this.next();
		}
		this.back();

		if (str == 'true' || str == 'false') {
			return new Token(TT.BOOL, str === 'true', start, this.pos);
		} else if (Object.values(KW).includes(str as KW)) {
			return new Token(TT.KEYWORD, str, start, this.pos);
		} else {
			return new Token(TT.IDENTIFIER, str, start, this.pos);
		}
	}

	private makeComparison() {
		switch (this.curr) {
			case '=': return this.checkComparison(TT.EQ, TT.EQTO);
			case '<': return this.checkComparison(TT.LTHAN, TT.LTHANEQ);
			case '>': return this.checkComparison(TT.GTHAN, TT.GTHANEQ);
			case '!': return this.checkComparison(TT.NEQTO, TT.NEQTO);
		}
	}

	private checkComparison(only: TT, withEq: TT) {
		const start = this.pos.copy();
		this.next();
		if (this.curr == '=') {
			return new Token(withEq, null, start, this.pos);
		}
		if (only == TT.NEQTO) {
			ExpectedCharError.emit("Expected an equal sign '=' after '!'", "Expected '=' here", this.pos, this.pos);
		}
		this.back();
		return new Token(only, null, this.pos);
	}

	private skipComment() {
		this.next();

		while (this.curr != '\n' && this.curr != null) {
			this.next();
		}
		this.next();
	}

	private skipMultiComment() {
		this.next();

		while (!(this.curr == '-' && this.peek() == '/') && this.curr != null) {
			this.next();
		}
		this.next();
	}
}