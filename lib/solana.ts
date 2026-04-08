import { Connection, PublicKey } from "@solana/web3.js";
import { keccak_256 } from "@noble/hashes/sha3.js";

const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID ?? "CELsxhAryfqKGXmXuaTNyFMQDJhRGCYCKLRaE7oMUP3t"
);

const RPC_URL =
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export interface ProductRecord {
  productPDA: string;
  manufacturer: string;
  uidHash: string;
  registeredAt: number;
  metadataUri: string;
  active: boolean;
}

/**
 * Decode a ProductRecord account from raw account data.
 * Layout (Anchor borsh):
 *   8  bytes — discriminator
 *   32 bytes — manufacturer (Pubkey)
 *   32 bytes — uid_hash ([u8; 32])
 *   8  bytes — registered_at (i64 LE)
 *   4  bytes — metadata_uri length prefix
 *   N  bytes — metadata_uri (utf-8)
 *   1  byte  — active (bool)
 *   1  byte  — bump
 */
function decodeProductRecord(data: Buffer): Omit<ProductRecord, "productPDA"> {
  let offset = 8; // skip 8-byte discriminator

  const manufacturer = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
  offset += 32;

  const uidHash = data.subarray(offset, offset + 32).toString("hex");
  offset += 32;

  const registeredAt = Number(data.readBigInt64LE(offset));
  offset += 8;

  const uriLen = data.readUInt32LE(offset);
  offset += 4;
  const metadataUri = data.subarray(offset, offset + uriLen).toString("utf8");
  offset += uriLen;

  const active = data[offset] === 1;

  return { manufacturer, uidHash, registeredAt, metadataUri, active };
}

/**
 * Hash a tag UID with keccak256, matching what the minting service does.
 */
export function hashUid(uid: string): Buffer {
  const uidBytes = Buffer.from(uid.replace(/\s/g, ""), "hex");
  return Buffer.from(keccak_256(uidBytes));
}

/**
 * Derive the product PDA address for a given UID without hitting the chain.
 */
export function deriveProductPDA(uid: string): PublicKey {
  const uidHash = hashUid(uid);
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("product"), uidHash],
    PROGRAM_ID
  );
  return pda;
}

/**
 * Look up a product's on-chain record by tag UID.
 * Returns null if the account doesn't exist (product not registered).
 */
export async function lookupProduct(uid: string): Promise<ProductRecord | null> {
  const connection = new Connection(RPC_URL, "confirmed");
  const productPDA = deriveProductPDA(uid);

  const account = await connection.getAccountInfo(productPDA);
  if (!account) return null;

  const decoded = decodeProductRecord(account.data as Buffer);
  return { productPDA: productPDA.toBase58(), ...decoded };
}
