import FuncLiteral from '../literals/FuncLiteral';
import ListLiteral from '../literals/ListLiteral';
import StrLiteral from '../literals/StrLiteral';

export default new FuncLiteral('symbols', [], ({ start, end, scope }) => {
	const keys = Array.from(scope.symbolTable.symbols.keys());
	const result: StrLiteral[] = [];

	for (let i = 0; i < keys.length; i++) {
		// const value = scope.symbolTable.get(keys[i]) instanceof FuncLiteral ? `${keys[i]}()` : keys[i];
		result.push(new StrLiteral(keys[i], null, start, end, scope));
	}

	return new ListLiteral(result, null, start, end, scope);
});