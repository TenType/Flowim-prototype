export const enum TT {
	DELIMIT = 'DELIMITER',
	COMMA = 'COMMA',

	INT = 'INT',
	FLOAT = 'FLOAT',
	BOOL = 'BOOL',
	STR = 'STR',

	KEYWORD = 'KEYWORD',
	IDENTIFIER = 'IDENTIFIER',
	EQ = 'EQUALS',

	EQTO = '==',
	NEQTO = '!=',
	LTHAN = '<',
	GTHAN = '>',
	LTHANEQ = '<=',
	GTHANEQ = '>=',

	LPAREN = 'LPAREN',
	RPAREN = 'RPAREN',
	LSQUARE = 'LSQUARE',
	RSQUARE = 'RSQUARE',
	EOF = 'EOF',

	ADD = 'PLUS',
	SUB = 'MINUS',
	MUL = 'TIMES',
	DIV = 'DIVBY',
	POW = 'POW',
	MOD = 'MOD',
	CONCAT = 'CONCAT',
}

// // eslint-disable-next-line @typescript-eslint/no-redeclare
// export type TT = typeof TT[keyof typeof TT];

export const LETTERS = /[a-zA-Z_]/;
export const LETTERS_NUMS = /[a-zA-Z0-9_]/;

export enum KW {
	VAR = 'var',
	FUNC = 'func',

	OR = 'or',
	AND = 'and',
	NOT = 'not',

	IF = 'if',
	THEN = 'then',
	ELSE = 'else',
	ELIF = 'elif',
	FOR = 'for',
	WHILE = 'while',
	DO = 'do',
	END = 'end',

	RETURN = 'return',
	CONTINUE = 'continue',
	BREAK = 'break',
}
// export const KEYWORDS = ['var', 'or', 'and', 'not', 'if', 'else', 'elif', 'for', 'while'];
export const DIGITS = '0123456789';
export const PARENTHESES = '()[]';
export const OPERATORS = '+-*/^%&';
export const COMPARISONS = '=<>!';

export const ESCAPE_CHARS: { [key: string]: string } = {
	'n': '\n',
	't': '\t',
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
export type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Change to 'true' to show types for outputs
export const DEBUG = false;