export type Type = 'UPPERCASE' | 'LOWERCASE' | 'CAPITALIZE' | 'PASCALCASE';

export interface Props {
	value: string;
	type: Type;
}

export class Text {
	private readonly props: Props;

	constructor(value: string, type: Type) {
		this.props = { value, type };
	}

	get value(): string {
		return this.props.value;
	}

	get type(): Type {
		return this.props.type;
	}

	private static uppercase(value: string): string {
		return value.trim().toUpperCase();
	}

	private static capitalize(value: string): string {
		return value.replace(/(^\s*\w|[.!?]\s*\w)/gm, match => match.toUpperCase()).trim();
	}

	private static lowercase(value: string): string {
		return value.trim().toLowerCase();
	}

	private static pascalcase(value: string): string {
		const chunks = value.trimEnd().trimStart().split(' ');

		const result = chunks
			.map(chunk => {
				const firistWord = chunk.split('')[0];

				const rest = chunk.substring(1, chunk.length);

				const toLowerCase = this.lowercase(rest);

				const toUpperCase = this.uppercase(firistWord);

				const result = `${toUpperCase}${toLowerCase}`;
				return result;
			})
			.join(' ');

		return result;
	}

	static compare(text1: Text | string, text2: Text | string, preserveCase?: boolean): boolean {
		if (text1 instanceof Text) return text1.equals(text2, preserveCase);
		if (text2 instanceof Text) return text2.equals(text1, preserveCase);

		if (preserveCase) return text1 === text2;

		return Text.compare(Text.create(text1, 'UPPERCASE'), Text.create(text2, 'UPPERCASE'));
	}

	static isEmpty(value: string): boolean {
		return value.trim().length === 0;
	}

	static create(value: string, type: Type): Text {
		switch (type) {
			case 'LOWERCASE': {
				value = this.lowercase(value);
				break;
			}
			case 'PASCALCASE': {
				value = this.pascalcase(value);
				break;
			}
			case 'CAPITALIZE': {
				value = this.capitalize(value);
				break;
			}
			case 'UPPERCASE': {
				value = this.uppercase(value);
				break;
			}
		}

		return new Text(value, type);
	}

	public equals(value: Text | string, preserveCase?: boolean): boolean {
		if (preserveCase === true && value instanceof Text) {
			return value.value === this.value;
		}

		if (preserveCase === true && typeof value === 'string') {
			return value === this.value;
		}

		if (value instanceof Text) {
			return Text.create(value.value, this.type).value === this.value;
		}

		return Text.create(value, this.type).value === this.value;
	}
}
