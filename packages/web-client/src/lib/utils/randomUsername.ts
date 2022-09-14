export function generateRandomNumber(length: number): string {
	return Math.floor(Math.random() * Math.pow(10, length))
		.toString()
		.padEnd(length, '0');
}

export function generateRandomName(type: 'name' | 'username', seed: string) {
	const sum = seed.split('').reduce((acc, val) => val.charCodeAt(0) + acc, 0);

	const n1 = ['Blue', 'Green', 'Red', 'Orange', 'Violet', 'Indigo', 'Yellow'];
	const n2 = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Zero'];

	const r1 = n1[sum % 7];
	const r2 = n2[sum % 10];

	if (type === 'name') {
		return `${r1} ${r2}`;
	} else {
		return `${r1.toLowerCase()}-${r2.toLowerCase()}-${generateRandomNumber(4)}`;
	}
}
