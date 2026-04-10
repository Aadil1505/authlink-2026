const SDM_BACKEND_URL = process.env.SDM_BACKEND_URL;

export interface SdmResult {
  uid: string;
  ctr: number;
}

/**
 * Validate a tag's CMAC against the SDM backend.
 * Returns the parsed UID + counter on success, throws on failure.
 *
 * The SDM backend returns 200 for valid CMAC, 4xx for invalid.
 */
export async function validateTag(
  uid: string,
  ctr: string,
  cmac: string
): Promise<SdmResult> {
  if (!SDM_BACKEND_URL) {
    throw new Error("SDM_BACKEND_URL is not configured");
  }

  const url = new URL(`${SDM_BACKEND_URL.replace(/\/$/, "")}/api/tagpt`);
  url.searchParams.set("uid", uid);
  url.searchParams.set("ctr", ctr);
  url.searchParams.set("cmac", cmac);

  const res = await fetch(url.toString(), {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`CMAC invalid (${res.status})`);
  }

  const data = await res.json();
  return { uid: data.uid ?? uid, ctr: data.ctr ?? parseInt(ctr, 16) };
}
