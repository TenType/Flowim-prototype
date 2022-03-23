import Position from '../Position';
import SymbolTable from './SymbolTable';

export default class Scope {
	public symbolTable: SymbolTable;

	public constructor(
		public name: string,
		public parent?: Scope,
		public parentPos?: Position,
	) {
	}
}