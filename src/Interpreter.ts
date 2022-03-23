import Scope from './context/Scope';
import globalTable from './context/GlobalTable';
import StatementsNode from './tree/StatementsNode';

export default class Interpreter {
	public static run(AST: StatementsNode, scope: Scope) {
		// const scope = new Scope('<main>');
		scope.symbolTable = globalTable;
		const result = AST.visit(scope);
		// if (result == null) return '';
		return result;
	}
}