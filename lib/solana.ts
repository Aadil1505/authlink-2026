import { createHash } from "crypto";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { keccak_256 } from "@noble/hashes/sha3.js";

const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID ?? "CELsxhAryfqKGXmXuaTNyFMQDJhRGCYCKLRaE7oMUP3t"
);

const RPC_URL =
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Anchor instruction discriminator: first 8 bytes of sha256("global:<name>") */
function disc(name: string): Buffer {
  return Buffer.from(
    createHash("sha256").update(`global:${name}`).digest().subarray(0, 8)
  );
}

/** Borsh-encode a string: 4-byte LE length prefix + UTF-8 bytes. */
function borshString(s: string): Buffer {
  const bytes = Buffer.from(s, "utf-8");
  const len = Buffer.alloc(4);
  len.writeUInt32LE(bytes.length, 0);
  return Buffer.concat([len, bytes]);
}

/** Admin keypair loaded from ADMIN_KEYPAIR_JSON env var (JSON byte array). */
function getAdminKeypair(): Keypair {
  const raw = process.env.ADMIN_KEYPAIR_JSON;
  if (!raw) throw new Error("ADMIN_KEYPAIR_JSON is not set");
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
}

/** keccak256 hash of a tag UID hex string → 32-byte Buffer. */
export function hashUid(uid: string): Buffer {
  const bytes = Buffer.from(uid.replace(/\s/g, ""), "hex");
  return Buffer.from(keccak_256(bytes));
}

// ── PDA derivation ────────────────────────────────────────────────────────────

/**
 * Derive the ManufacturerRecord PDA for a given Authlink DB user ID.
 * Seeds: [b"manufacturer", userId.as_bytes()]
 */
export function deriveManufacturerPda(userId: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("manufacturer"), Buffer.from(userId)],
    PROGRAM_ID
  );
  return pda;
}

function deriveConfigPda(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID
  );
  return pda;
}

// ── Instruction encoding (Anchor Borsh) ───────────────────────────────────────

function encodeRegisterManufacturer(manufacturerId: string, name: string): Buffer {
  return Buffer.concat([
    disc("register_manufacturer"),
    borshString(manufacturerId),
    borshString(name),
  ]);
}

function encodeRegisterProduct(uidHash: Buffer, metadataUri: string): Buffer {
  return Buffer.concat([
    disc("register_product"),
    uidHash,
    borshString(metadataUri),
  ]);
}

function encodeRevokeProduct(uidHash: Buffer): Buffer {
  return Buffer.concat([disc("revoke_product"), uidHash]);
}

// ── On-chain calls ────────────────────────────────────────────────────────────

/**
 * Ensure a ManufacturerRecord PDA exists for this user.
 * Called automatically before register_product — safe to call every time.
 */
async function ensureManufacturerRegistered(
  userId: string,
  manufacturerName: string,
  connection: Connection,
  admin: Keypair,
  configPda: PublicKey
): Promise<PublicKey> {
  const manufacturerPda = deriveManufacturerPda(userId);

  const existing = await connection.getAccountInfo(manufacturerPda);
  if (existing !== null) {
    return manufacturerPda;
  }

  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: manufacturerPda, isSigner: false, isWritable: true },
      { pubkey: configPda, isSigner: false, isWritable: false },
      { pubkey: admin.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: encodeRegisterManufacturer(userId, manufacturerName),
  });

  const tx = new Transaction().add(ix);
  await sendAndConfirmTransaction(connection, tx, [admin]);

  return manufacturerPda;
}

/**
 * Register a physical NFC tag on-chain by emitting a ProductRegistered event.
 * Auto-initializes the ManufacturerRecord PDA on first use.
 * Returns the transaction signature — stored in Postgres as the proof.
 *
 * metadataUri should be: `${APP_URL}/api/products/${productId}/metadata`
 */
export async function registerTagOnChain(
  uid: string,
  userId: string,
  metadataUri: string,
  manufacturerName = "Manufacturer"
): Promise<{ signature: string; manufacturerPda: string }> {
  const admin = getAdminKeypair();
  const connection = new Connection(RPC_URL, "confirmed");
  const configPda = deriveConfigPda();
  const uidHash = hashUid(uid);

  const manufacturerPda = await ensureManufacturerRegistered(
    userId,
    manufacturerName,
    connection,
    admin,
    configPda
  );

  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: manufacturerPda, isSigner: false, isWritable: false },
      { pubkey: configPda, isSigner: false, isWritable: false },
      { pubkey: admin.publicKey, isSigner: true, isWritable: true },
    ],
    data: encodeRegisterProduct(uidHash, metadataUri),
  });

  const tx = new Transaction().add(ix);
  const signature = await sendAndConfirmTransaction(connection, tx, [admin]);

  return { signature, manufacturerPda: manufacturerPda.toBase58() };
}

/**
 * Revoke a tag on-chain by emitting a ProductRevoked event.
 * Returns the revocation transaction signature.
 */
export async function revokeTagOnChain(
  uid: string,
  userId: string
): Promise<string> {
  const admin = getAdminKeypair();
  const connection = new Connection(RPC_URL, "confirmed");

  const manufacturerPda = deriveManufacturerPda(userId);
  const configPda = deriveConfigPda();
  const uidHash = hashUid(uid);

  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: manufacturerPda, isSigner: false, isWritable: false },
      { pubkey: configPda, isSigner: false, isWritable: false },
      { pubkey: admin.publicKey, isSigner: true, isWritable: true },
    ],
    data: encodeRevokeProduct(uidHash),
  });

  const tx = new Transaction().add(ix);
  return sendAndConfirmTransaction(connection, tx, [admin]);
}

// ── Explorer ──────────────────────────────────────────────────────────────────

const CLUSTER = process.env.SOLANA_CLUSTER ?? "devnet";

export function explorerTxUrl(signature: string): string {
  const suffix = CLUSTER === "mainnet-beta" ? "" : `?cluster=${CLUSTER}`;
  return `https://explorer.solana.com/tx/${signature}${suffix}`;
}

export function explorerAddressUrl(address: string): string {
  const suffix = CLUSTER === "mainnet-beta" ? "" : `?cluster=${CLUSTER}`;
  return `https://explorer.solana.com/address/${address}${suffix}`;
}

// ── Admin keypair pubkey (for display) ───────────────────────────────────────

export function getAdminPublicKey(): string {
  return getAdminKeypair().publicKey.toBase58();
}
