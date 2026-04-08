const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

export interface ProductMetadata {
  name?: string;
  description?: string;
  image?: string;
  [key: string]: unknown;
}

/**
 * Fetch product metadata from an IPFS URI.
 * Converts ipfs://Qm... to https://ipfs.io/ipfs/Qm...
 * Returns null on any failure — metadata is optional.
 */
export async function fetchMetadata(
  uri: string
): Promise<ProductMetadata | null> {
  if (!uri) return null;

  try {
    const url = uri.startsWith("ipfs://")
      ? uri.replace("ipfs://", IPFS_GATEWAY)
      : uri;

    const res = await fetch(url, {
      cache: "force-cache",
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
