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

    const { orderID, plan, billingCycle, promoCode = '' } = body || {};

    if (typeof orderID !== 'string' || !/^[A-Z0-9-]{8,80}$/i.test(orderID) || !PLAN_PRICES[plan]) {
      return res.status(400).json({
        error: 'INVALID_PARAMS',
        message: 'A valid PayPal order ID and plan are required.',
      });
    }

    if (billingCycle !== 'annual' && billingCycle !== 'monthly') {
      return res.status(400).json({ error: 'INVALID_BILLING_CYCLE', message: 'Invalid billing cycle.' });
    }

    const normalizedPromo = typeof promoCode === 'string' ? promoCode.trim().toUpperCase() : '';
    const discount = ['EGYPT2026', 'LAUNCH50'].includes(normalizedPromo)
      ? 0.5
      : normalizedPromo === 'LAWYER20' ? 0.2 : 0;
    const planConfig = PLAN_PRICES[plan];
    const expectedAmount = Math.round(
      (billingCycle === 'annual' ? planConfig.annual : planConfig.monthly) * (1 - discount) * 100,
    ) / 100;

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

    // Check the approved order's amount before capturing it. Never trust plan/price data from the browser.
    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderID)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const orderData = await orderResponse.json();
    const orderAmount = orderData.purchase_units?.[0]?.amount;
    if (!orderResponse.ok || orderData.status !== 'APPROVED' || orderAmount?.currency_code !== 'USD' ||
        Number(orderAmount?.value) !== expectedAmount) {
      return res.status(400).json({
        error: 'ORDER_DETAILS_MISMATCH',
        message: 'بيانات الطلب أو قيمته لا تطابق الباقة المعتمدة. لم يتم اعتماد الرصيد.',
      });
    }

    // Capture only after validating the approved order against server-side plan pricing.
    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await captureResponse.json();

    // Verify status is COMPLETED
    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    if (captureData.status !== 'COMPLETED' || capture?.status !== 'COMPLETED' ||
        capture?.amount?.currency_code !== 'USD' || Number(capture?.amount?.value) !== expectedAmount) {
      console.warn('[PayPal Capture Not Completed]:', captureData);
      return res.status(400).json({
        error: 'PAYMENT_NOT_COMPLETED',
        message: `حالة الدفع غير مكتملة على PayPal (${captureData.status || 'UNKNOWN'}). لم يتم خصم المبلغ بنجاح.`,
      });
    }

    // Step 3: Determine unlocked plan and credits
    const isAnnual = billingCycle === 'annual';
    const addedCredits = isAnnual ? planConfig.creditsAnnual : planConfig.creditsMonthly;

    return res.status(200).json({
      success: true,
      verified: true,
      transactionId: capture.id,
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
