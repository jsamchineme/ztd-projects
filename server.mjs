// Two Studio services run this same file from this folder: "web" (Didit) and "visa" (Visa Plan).
// Pick the app from the public address the service was given.
if (/visaplan\./.test(process.env.PUBLIC_URL || '')) await import('./visa/server.mjs');
else await import('./didit.mjs');
