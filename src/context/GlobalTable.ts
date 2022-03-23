import SymbolTable from './SymbolTable';
import FloatLiteral from '../literals/FloatLiteral';

import print from '../stdlib/print';
import input from '../stdlib/input';
import clear from '../stdlib/clear';
import symbols from '../stdlib/symbols';
import run from '../stdlib/run';
import eval from '../stdlib/eval';

const funcs = [input, print, clear, symbols, run, eval];

const globalTable = new SymbolTable();
for (let i = 0; i < funcs.length; i++) {
	globalTable.set(funcs[i].name, funcs[i]);
}

globalTable.set('pi', new FloatLiteral(Math.PI));
// globalTable.set('e', new FloatLiteral(Math.E));

export default globalTable;