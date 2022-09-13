import { Principal } from '@dfinity/principal';
import Log from './Log';

const avatars = [
	'https://i.imgur.com/QlRZXTs.png',
	'https://i.imgur.com/HGW3wOR.png',
	'https://i.imgur.com/mUN0jC5.png',
	'https://i.imgur.com/9C3DgcZ.png',
	'https://i.imgur.com/i8can35.png',
	'https://i.imgur.com/ZNzKUr3.png',
	'https://i.imgur.com/nX9gdy6.png',
	'https://i.imgur.com/ydTJOfg.png',
	'https://i.imgur.com/Nx24737.png',
	'https://i.imgur.com/EuxuoVu.png',
	'https://i.imgur.com/Fa1ZX4s.png',
	'https://i.imgur.com/29yeGr4.png',
	'https://i.imgur.com/4oQETm1.png',
	'https://i.imgur.com/QugNkKQ.png',
	'https://i.imgur.com/2dwwxtU.png',
	'https://i.imgur.com/GJDBKsR.png',
	'https://i.imgur.com/AvCY6cd.png',
	'https://i.imgur.com/N4WHCEu.png',
	'https://i.imgur.com/3fnuDZn.png',
	'https://i.imgur.com/3wQVn0e.png'
];

export default (principal?: Principal | string) => {
	let string = 'random';
	if (principal instanceof Principal && principal) {
		string = principal.toText();
	} else if (principal) {
		string = principal;
	}
	Log({ defaultUrl: string }, 'info');
	const sum = string.split('').reduce((acc, val) => val.charCodeAt(0) + acc, 0);
	return avatars[sum % 20];
};
