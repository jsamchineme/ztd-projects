// Central config. Everything from env; no secrets hard-coded.
export const config = {
  port: Number(process.env.PORT || 4404),
  platformDomain: process.env.PLATFORM_DOMAIN || 'businessmail.ztddevs.com',
  appUrl: process.env.APP_URL || 'https://businessmail.ztddevs.com',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendWebhookSecret: process.env.RESEND_WEBHOOK_SECRET || '',
  resendApiBase: process.env.RESEND_API_BASE || 'https://api.resend.com',
  dbPath: process.env.DB_PATH || new URL('../data/mail.db', import.meta.url).pathname,
  attachmentsDir: process.env.ATTACHMENTS_DIR || new URL('../data/attachments', import.meta.url).pathname,
  sessionTtlDays: Number(process.env.SESSION_TTL_DAYS || 30),
  cookieSecure: (process.env.COOKIE_SECURE ?? 'true') !== 'false',
  isProd: process.env.NODE_ENV === 'production',
};

// TEST_MODE: no real API key -> use the in-memory fake Resend. Lets everything run offline / in tests.
export const TEST_MODE = !config.resendApiKey || process.env.TEST_MODE === '1';
