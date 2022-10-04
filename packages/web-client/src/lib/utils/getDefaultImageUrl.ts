import { Principal } from '@dfinity/principal';

const host = 'https://imagedelivery.net/abXI9nS4DYYtyR1yFFtziA';
const cfAvatarImageIds = [
	'01452301-3861-4b96-c9ee-b3e443a22300',
	'3317a9a5-df08-44cd-fc9d-9b5c7066fd00',
	'b4cb25e8-efa1-4560-9990-2fcb55794e00',
	'8c602cc9-09c1-473b-ea9d-3973b4730700',
	'2b2963fd-36cf-4fb0-a37e-8d9e37d84c00',
	'3b0b7c6d-ff3f-48dc-8a50-8d317579b300',
	'51434d58-119c-4dc6-ea36-079498eba400',
	'05ac99c9-18d6-4f0c-ccd3-7d0974057400',
	'fa856806-2a8e-4079-0f59-151a90789c00',
	'8123f9e8-8e4a-40d6-f42b-9991bc611e00',
	'4357594e-1557-4cc5-7677-ccdcb89f2e00',
	'c86b4d37-6751-4e9b-c0a7-0fa2b68e0300',
	'f5ba394b-472a-485c-eff5-8dec88d5e800',
	'940a5534-e5c8-4609-02d3-f6435d9b7800',
	'9537bbf2-88c2-4924-88ce-140a4f709300',
	'1395d656-5d42-445f-9909-c0bc72ff6600',
	'0bbb24da-0dbc-4252-60ef-4f642a1fc200',
	'721a3f2d-655e-4c6d-06f2-090c63bf4600',
	'9d728621-e33c-444f-b81c-c6502b30e600',
	'098ae9bb-be53-4128-5918-2b794250ae00'
];

export default (principal?: Principal | string) => {
	let string = 'random';
	if (typeof principal === 'string') {
		string = principal;
	} else if (principal?._isPrincipal) {
		string = Principal.from(principal).toText();
	}
	const sum = string.split('').reduce((acc, val) => val.charCodeAt(0) + acc, 0);
	return `${host}/${cfAvatarImageIds[sum % 20]}/public`;
};
