import FuncLiteral from '../literals/FuncLiteral';
import { question } from 'readline-sync';
import StrLiteral from '../literals/StrLiteral';

export default new FuncLiteral('input', [], ({ start, end, scope }) => {
	const input = question();
	return new StrLiteral(input, null, start, end, scope);
});