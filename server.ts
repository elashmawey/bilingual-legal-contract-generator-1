import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ContractFormData } from './types';
import { generateContractWithAI } from './services/contractGeneratorService';

// Automatically load local .env if present (supported natively in modern Node.js)
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch {
    // .env is optional locally
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// API Endpoint for generating contract
app.post('/api/generate-contract', async (req: Request, res: Response) => {
  const formData: ContractFormData = req.body;
  if (!formData || !formData.contractType) {
    return res.status(400).json({ error: 'Missing contract parameters' });
  }

  try {
    const contract = await generateContractWithAI(formData);
    return res.json(contract);
  } catch (error: any) {
    console.error('[Server] Contract generation failed:', error);
    const statusCode = error.statusCode || (error.code === 'RATE_LIMIT_EXCEEDED' ? 429 : 500);
    return res.status(statusCode).json({
      error: error.code || 'GENERATION_FAILED',
      message: error.message || 'Failed to generate contract',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
