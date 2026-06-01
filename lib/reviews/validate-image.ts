const SIGNATURES: { mime: string; bytes: number[] }[] = [
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] },
];

export function detectImageMime(buffer: Buffer): string | null {
  for (const sig of SIGNATURES) {
    if (buffer.length < sig.bytes.length) continue;
    const match = sig.bytes.every((b, i) => buffer[i] === b);
    if (match) {
      if (sig.mime === 'image/webp' && buffer.length >= 12) {
        const webp = buffer.subarray(8, 12).toString('ascii');
        if (webp !== 'WEBP') continue;
      }
      return sig.mime;
    }
  }
  return null;
}
