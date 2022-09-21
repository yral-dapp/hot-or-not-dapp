export function generateRandomNumber(length: number, seed: number): string {
	let r = Math.sin(seed) * 10;
	r = r - Math.floor(r);
	return Math.floor(r * Math.pow(10, length))
		.toString()
		.padEnd(length, '0');
}

export function generateRandomName(type: 'name' | 'username', seed?: string) {
	if (!seed) {
		seed = 'random';
	}
	const sum = seed.split('').reduce((acc, val) => val.charCodeAt(0) + acc, 0);

	const n1 = ['Blue', 'Green', 'Red', 'Orange', 'Violet', 'Indigo', 'Yellow'];
	const n2 = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Zero'];

	const r1 = n1[sum % 7];
	const r2 = n2[sum % 10];

	if (type === 'name') {
		return `${r1} ${r2}`;
	} else {
		return `${r1.toLowerCase()}-${r2.toLowerCase()}-${generateRandomNumber(4, sum)}`;
	}
}
