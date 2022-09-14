export function generateRandomNumber(length: number): string {
	return Math.floor(Math.random() * Math.pow(10, length))
		.toString()
		.padEnd(length, '0');
}

export function generateRandomName(type: 'name' | 'username') {
	const n1 = ['Blue ', 'Green', 'Red', 'Orange', 'Violet', 'Indigo', 'Yellow '];
	const n2 = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Zero'];
	const r1 = n1[Math.floor(Math.random() * n1.length)];
	const r2 = n2[Math.floor(Math.random() * n2.length)];
	if (type === 'name') {
		return `${r1} ${r2}`;
	} else {
		return `${r1.toLowerCase()}-${r2.toLowerCase()}-${generateRandomNumber(4)}`;
	}
}
