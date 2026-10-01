import { timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const configuredCode = process.env.OWNER_ACCESS_CODE;
  const suppliedCode = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
  if (!configuredCode || !suppliedCode) {
    return res.status(401).json({ error: 'OWNER_ACCESS_DENIED' });
  }

  const expected = Buffer.from(configuredCode);
  const supplied = Buffer.from(suppliedCode);
  const matches = expected.length === supplied.length && timingSafeEqual(expected, supplied);
  if (!matches) return res.status(401).json({ error: 'OWNER_ACCESS_DENIED' });

  return res.status(200).json({ authorized: true });
}
