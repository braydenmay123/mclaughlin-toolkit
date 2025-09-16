import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// Contact form endpoint
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

function getRateLimitKey(c: any): string {
  const forwarded = c.req.header('x-forwarded-for');
  const realIp = c.req.header('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';
  return ip;
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

app.post('/contact', async (c) => {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(c);
    if (isRateLimited(rateLimitKey)) {
      return c.json({ ok: false, error: 'Too many requests. Please try again later.' }, 429);
    }

    const body: ContactFormData = await c.req.json();
    
    // Honeypot check (spam protection)
    if (body.honeypot && body.honeypot.trim() !== '') {
      return c.json({ ok: false, error: 'Invalid submission' }, 400);
    }

    // Validate required fields
    if (!body.name || !body.email || !body.interest || !body.pageSource) {
      return c.json({ ok: false, error: 'Missing required fields' }, 400);
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
      return c.json({ ok: false, error: 'Invalid email format' }, 400);
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
        return c.json({ ok: true });
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
    return c.json({ ok: true });

  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ ok: false, error: 'Internal server error' }, 500);
  }
});

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;