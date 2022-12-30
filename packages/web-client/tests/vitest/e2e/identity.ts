import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import hdkey from 'hdkey';
import bip39 from 'bip39';

// Completely insecure seed phrase. Do not use for any purpose other than testing.
const seed = 'harsh harsh harsh harsh harsh harsh harsh harsh harsh harsh harsh harsh';

export const identityFromSeed = async (phrase) => {
	const seed = await bip39.mnemonicToSeed(phrase);
	const root = hdkey.fromMasterSeed(seed);
	const addrnode = root.derive("m/44'/223'/0'/0/0");

	return Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
};

export const identity = identityFromSeed(seed);