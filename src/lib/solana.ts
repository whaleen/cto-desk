// src/lib/solana.ts

import { Connection, PublicKey } from '@solana/web3.js'

export async function verifyTokenOwnership(
  userId: string,
  tokenMintAddress: string
): Promise<boolean> {
  const connection = new Connection('https://api.mainnet-beta.solana.com')
  const publicKey = new PublicKey(userId)

  const balance = await connection.getTokenAccountBalance(
    publicKey,
    tokenMintAddress
  )
  return balance.value.uiAmount > 0
}
