import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1'

// Completely insecure seed phrase. Do not use for any purpose other than testing.
const seed =
  'harsh harsh harsh harsh harsh harsh harsh harsh harsh harsh harsh harsh'

export const identityFromSeed = async (phrase) => {
  return Secp256k1KeyIdentity.fromSeedPhrase(phrase)
}

export const identity = identityFromSeed(seed)
