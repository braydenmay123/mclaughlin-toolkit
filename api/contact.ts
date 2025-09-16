import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  notes?: string;
  pageSource: string;
  honeypot?: string;
}

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

function getRateLimitKey(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) : req.headers['x-real-ip'] || 'unknown';
  return typeof ip === 'string' ? ip : 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 500);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(req);
    if (isRateLimited(rateLimitKey)) {
      return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
    }

    const body: ContactFormData = req.body;
    
    // Honeypot check (spam protection)
    if (body.honeypot && body.honeypot.trim() !== '') {
      return res.status(400).json({ ok: false, error: 'Invalid submission' });
    }

    // Validate required fields
    if (!body.name || !body.email || !body.interest || !body.pageSource) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      phone: body.phone ? sanitizeInput(body.phone) : undefined,
      interest: sanitizeInput(body.interest),
      notes: body.notes ? sanitizeInput(body.notes) : undefined,
      pageSource: sanitizeInput(body.pageSource)
    };

    // Validate email format
    if (!validateEmail(sanitizedData.email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email format' });
    }

    // Prepare email content
    const emailSubject = `Platform Contact — ${sanitizedData.interest} — ${sanitizedData.name}`;
    const emailBody = `
New contact form submission from McLaughlin Financial Group Platform:

Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone || 'Not provided'}
Interest: ${sanitizedData.interest}
Page Source: ${sanitizedData.pageSource}
Notes: ${sanitizedData.notes || 'None'}

Submitted at: ${new Date().toISOString()}
    `.trim();

    // Try to send email using Resend if API key is available
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'platform@mclaughlinfinancial.ca',
            to: ['info@mclaughlinfinancial.ca'],
            subject: emailSubject,
            text: emailBody,
          }),
        });

        if (!response.ok) {
          throw new Error(`Resend API error: ${response.status}`);
        }

        console.log('Email sent successfully via Resend');
        return res.status(200).json({ ok: true });
      } catch (error) {
        console.error('Resend email failed:', error);
        // Fall through to fallback method
      }
    }

    // Fallback: Log to console
    console.log('Contact form submission (email service not configured):');
    console.log('Subject:', emailSubject);
    console.log('Body:', emailBody);

    // Always return success to avoid blocking users
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}