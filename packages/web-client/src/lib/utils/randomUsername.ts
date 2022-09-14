export function generateRandomNumber(length: number): string {
	return Math.floor(Math.random() * Math.pow(10, length))
		.toString()
		.padEnd(length, '0');
}

export function generateUsername() {
	const n1 = ['Blue ', 'Green', 'Red', 'Orange', 'Violet', 'Indigo', 'Yellow '];
	const n2 = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Zero'];
	return (
		n1[Math.floor(Math.random() * n1.length)] +
		'-' +
		n2[Math.floor(Math.random() * n2.length)] +
		'-' +
		generateRandomNumber(4)
	);
}
