// Entry point: registers all views, then renders on every hash change.
import { render } from './core.js';
import './admin.js';
import './client.js';

addEventListener('hashchange', () => { document.querySelectorAll('.modal-bg, .drawer, .lightbox').forEach(m => m.remove()); render(); });
render();
