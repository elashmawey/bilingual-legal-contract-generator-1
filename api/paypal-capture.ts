import type { VercelRequest, VercelResponse } from '@vercel/node';

// Expected USD prices for plans
const PLAN_PRICES: { [key: string]: { monthly: number; annual: number; creditsMonthly: number; creditsAnnual: number } } = {
  pay_as_you_go: { monthly: 10, annual: 10, creditsMonthly: 1, creditsAnnual: 1 },
  starter: { monthly: 19, annual: 168, creditsMonthly: 5, creditsAnnual: 60 },
  pro: { monthly: 39, annual: 348, creditsMonthly: 25, creditsAnnual: 300 },
  enterprise: { monthly: 99, annual: 888, creditsMonthly: 100, creditsAnnual: 1200 },
};

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
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    const { orderID, plan, billingCycle } = body || {};

    if (!orderID || !plan) {
      return res.status(400).json({
        error: 'MISSING_PARAMS',
        message: 'orderID and plan are required to verify PayPal payment',
      });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const isSandbox = process.env.PAYPAL_MODE === 'sandbox';
    const baseUrl = isSandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

    // If developer hasn't configured PayPal API keys in Vercel yet
    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: 'PAYPAL_NOT_CONFIGURED',
        message: 'مفاتيح PAYPAL_CLIENT_ID و PAYPAL_CLIENT_SECRET غير موجودة في إعدادات Vercel. يرجى إضافتها في لوحة تحكم Vercel لتفعيل التحقق التلقائي.',
      });
    }

    // Step 1: Get PayPal OAuth2 Token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      const tokenErr = await tokenResponse.text();
      console.error('[PayPal Token Error]:', tokenErr);
      return res.status(500).json({
        error: 'PAYPAL_AUTH_FAILED',
        message: 'فشل الاتصال بخوادم PayPal للتحقق من المفاتيح. يرجى مراجعة بيانات الاعتماد.',
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Capture the PayPal Order
    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await captureResponse.json();

    // Verify status is COMPLETED
    if (captureData.status !== 'COMPLETED') {
      console.warn('[PayPal Capture Not Completed]:', captureData);
      return res.status(400).json({
        error: 'PAYMENT_NOT_COMPLETED',
        message: `حالة الدفع غير مكتملة على PayPal (${captureData.status || 'UNKNOWN'}). لم يتم خصم المبلغ بنجاح.`,
      });
    }

    // Step 3: Determine unlocked plan and credits
    const planConfig = PLAN_PRICES[plan] || PLAN_PRICES.starter;
    const isAnnual = billingCycle === 'annual';
    const addedCredits = isAnnual ? planConfig.creditsAnnual : planConfig.creditsMonthly;

    return res.status(200).json({
      success: true,
      verified: true,
      transactionId: captureData.id,
      plan,
      addedCredits,
      message: 'تم التحقق من الدفع بنجاح عبر PayPal وتفعيل الباقة المطلوبة!',
    });
  } catch (error: any) {
    console.error('[PayPal Verification Exception]:', error);
    return res.status(500).json({
      error: 'VERIFICATION_FAILED',
      message: error.message || 'حدث خطأ أثناء الاتصال بخوادم PayPal',
    });
  }
}
