import Scope from '../context/Scope';
import Position from '../Position';

export default abstract class Logger {
	protected constructor(
		private type: 'error' | 'warn',
		private name: string,
		private details: string,
		private highlightText: string,
		private start: Position,
		private end: Position,
		private scope?: Scope,
	) {}

	public get message() {
		let header = '';
		let color: string;
		if (this.type == 'error') {
			header = '\u001b[31;1m[error]\u001b[0m ';
			color = '\u001b[31;1m';
		} else if (this.type == 'warn') {
			header = '\u001b[33;1m[warn]\u001b[0m ';
			color = '\u001b[33;1m';
		}
		let message = `${header}\u001b[1m${this.name}\u001b[0m: ${this.details}`;
		if (this.start != null && this.end != null) {
			message += `\n\u001b[34m-> at ${this.start.fileName} (line ${this.start.line + 1}, col ${this.start.col + 1})\u001b[0m
\n${this.highlight(this.start.fileText.split('\n')[this.start.line], this.start.col, this.end.col, color, this.highlightText)}
${this.stackTrace()}`;
		}
		return message;
	}

	private highlight(text: string, start: number, end: number, color: string, highlightText?: string) {
		let spacing = '';
		for (let i = 0; i < start; i++) spacing += ' ';

		let result = `\t${text}\n\t`;
		result += `${color}${spacing}`;
		for (let i = start; i < end + 1; i++) result += '^';

		if (highlightText == null) highlightText = `${this.name} here`;
		result += ` ${highlightText}\u001b[0m`;
		return result;
	}

	private stackTrace() {
		let result = '\n\u001b[38;5;245mStack trace (most recent call first):';
		let pos = this.start;
		let scope = this.scope;

		if (scope == null) {
			return '';
		}

		let stackCount = 0;
		while (scope != null) {
			stackCount++;
			if (stackCount > 10) continue;
			result += `\n\tat ${scope.name} (${pos.fileName}:${pos.line + 1}:${pos.col + 1})`;
			pos = scope.parentPos;
			scope = scope.parent;
		}
		if (stackCount > 10) {
			result += `\n\t... ${stackCount - 10} more ...`;
		}
		result += '\u001b[0m';

		return result;
	}
}