import FuncLiteral from '../literals/FuncLiteral';

export default new FuncLiteral('print', ['value'], (context, { value }) => {
	console.log(value);
});