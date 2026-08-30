// nudge_open — every suite opens the page through this, so the address the tests
// use lives in ONE place. Set NUDGE_URL in the environment to point the whole
// battery somewhere else (a different port, a deployed copy, or the page's new
// home after the experiment moves).
export const NUDGE_URL = process.env.NUDGE_URL || 'http://localhost:8901/nudge/nudge.html';
