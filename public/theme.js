// Applies the light/dark choice saved by the sidebar's toggle before the page draws (no saved choice: follow the system).
try { const t = localStorage.getItem('studio.theme'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; } catch {}
