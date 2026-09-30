import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateContractWithAI } from '../services/contractGeneratorService';
import type { ContractFormData } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({
          error: 'INVALID_BODY',
          message: 'Invalid JSON payload received',
        });
      }
    }

    const formData = body as ContractFormData;
    if (!formData || !formData.contractType) {
      return res.status(400).json({
        error: 'MISSING_PARAMS',
        message: 'Contract parameters and contractType are required',
      });
    }

    const contract = await generateContractWithAI(formData);
    return res.status(200).json(contract);
  } catch (error: any) {
    console.error('[Vercel Serverless Function Error]:', error);

    const statusCode = error.statusCode || (error.code === 'RATE_LIMIT_EXCEEDED' ? 429 : 500);
    return res.status(statusCode).json({
      error: error.code || 'GENERATION_FAILED',
      message: error.message || 'حدث خطأ أثناء معالجة الطلب',
    });
  }
}
