import { LiteralTypes, StrReprTypes } from '../literals/BaseLiteral';

// export interface LiteralType {
// 	value: number | boolean | string;
// 	attributes: {
// 		type: StrReprTypes;
// 	}
// }

export default class SymbolTable {
	public symbols: Map<string, LiteralTypes> = new Map();
	constructor(private parent?: SymbolTable) {}

	public get(name: string): LiteralTypes {
		const value = this.symbols.get(name);
		if (value == null && this.parent) {
			return this.parent.get(name);
		}
		return value;
	}

	public set(name: string, data: LiteralTypes) {
		this.symbols.set(name, data);
	}

	public remove(name: string) {
		this.symbols.delete(name);
	}
}