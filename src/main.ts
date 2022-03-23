import run from './Runner';
import { question } from 'readline-sync';
import NullLiteral from './literals/NullLiteral';

while (true) {
	const code = question('\u001b[35;1m\u001b[1m>>> \u001b[0m');
	if (code.trim() == '') continue;
	const output = run('<stdin>', code);

	if (output == null) continue;

	if (output.value.length == 1) {
		if (!(output.value[0] instanceof NullLiteral)) console.log(output.value[0]);
	} else {
		console.log(output);
	}
}