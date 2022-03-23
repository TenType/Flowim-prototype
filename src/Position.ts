export default class Position {
	private colArr: number[] = [];

	public constructor(
		public index: number,
		public line: number,
		public col: number,
		public fileName: string,
		public fileText: string,
	) {}

	public next(curr: string) {
		this.index++;
		this.col++;

		if (curr == '\n') {
			this.line++;
			this.colArr.push(this.col);
			this.col = 0;
		}
		return this;
	}

	public back(curr: string) {
		this.index--;
		this.col--;

		if (curr == '\n') {
			this.line--;
			this.col = this.colArr.pop();
		}
	}

	public copy() {
		return new Position(this.index, this.line, this.col, this.fileName, this.fileText);
	}
}