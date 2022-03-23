import Scope from '../context/Scope';
import Position from '../Position';
import FuncLiteral from './FuncLiteral';
import BoolLiteral from './BoolLiteral';
import FloatLiteral from './FloatLiteral';
import IntLiteral from './IntLiteral';
import ListLiteral from './ListLiteral';
import StrLiteral from './StrLiteral';
import NullLiteral from './NullLiteral';
import StatementsLiteral from './StatementsLiteral';

export default abstract class BaseLiteral {
	public strRepr: StrReprTypes;
	protected constructor(public start: Position, public end: Position, public scope: Scope) {}
}

export type StrReprTypes =
	| 'int'
	| 'float'
	| 'bool'
	| 'func'
	| 'str'
	| 'list'
	| 'null'
	| 'statements';

export type DataTypes = number | boolean | string;

export type LiteralTypes =
	| BoolLiteral
	| FloatLiteral
	| FuncLiteral
	| IntLiteral
	| ListLiteral
	| StatementsLiteral
	| StrLiteral
	| NullLiteral;

export type NumberLiteral = IntLiteral | FloatLiteral;
export type LiteralValue = Exclude<LiteralTypes, FuncLiteral | NullLiteral>;