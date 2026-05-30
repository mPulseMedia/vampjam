// vampjam_worker.js — Cloudflare Worker that proxies tag/audio writes from the
// page back to the github repo, so devices never need a PAT.
//
// SETUP (one-time, in the Cloudflare dashboard):
//   1. dash.cloudflare.com → Workers & Pages → Create → Hello World
//   2. Name it e.g. vampjam-sync.
//   3. "Edit code" — paste this entire file, replace the contents.
//   4. Deploy.
//   5. After deploy, go to the Worker's Settings → Variables and Secrets:
//        Add a SECRET named GITHUB_PAT
//        Value: a fine-grained Personal Access Token with
//          Repository access: mPulseMedia/vampjam, Contents: Read & write.
//        (Create at github.com/settings/personal-access-tokens/new)
//   6. Copy the worker URL (looks like https://vampjam-sync.<your-subdomain>.workers.dev).
//      Send it to me and I'll wire it into the pages.

const REPO_OWNER = 'mPulseMedia';
const REPO_NAME  = 'vampjam';

// only requests from these origins are accepted (mild abuse barrier)
const ALLOWED_ORIGINS = [
  'https://mpulsemedia.github.io',
  'http://localhost',
  'null',                            // file:// sends Origin: null
];

// only files matching this regex can be written (also a mild abuse barrier)
const PATH_RE = /^[a-zA-Z0-9_\-]+\.json$/;

function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : 'null';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function b64utf8(s) {
  return btoa(unescape(encodeURIComponent(s)));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = cors(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 });
    }
    if (request.method !== 'POST') {
      return new Response('POST only', { status: 405, headers });
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('forbidden origin', { status: 403, headers });
    }
    if (!env.GITHUB_PAT) {
      return new Response('worker not configured: GITHUB_PAT secret missing', { status: 500, headers });
    }

    let body;
    try { body = await request.json(); }
    catch (e) { return new Response('invalid json', { status: 400, headers }); }

    const path = (body.path || '').trim();
    const content = body.content;
    const message = body.message || `update ${path}`;
    if (!PATH_RE.test(path)) {
      return new Response('invalid path', { status: 400, headers });
    }
    if (typeof content !== 'string') {
      return new Response('content (string) required', { status: 400, headers });
    }

    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
    const ghHeaders = {
      'Authorization': `Bearer ${env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'vampjam-worker',
    };

    // get current sha (if file exists)
    let sha = null;
    const getRes = await fetch(apiUrl, { headers: ghHeaders });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha || null;
    } else if (getRes.status !== 404) {
      const errText = await getRes.text();
      return new Response(`github GET ${getRes.status}: ${errText}`, { status: 502, headers });
    }

    const putBody = { message, content: b64utf8(content) };
    if (sha) putBody.sha = sha;

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      return new Response(`github PUT ${putRes.status}: ${errText}`, { status: 502, headers });
    }

    const out = await putRes.json();
    return new Response(JSON.stringify({ ok: true, sha: out.content && out.content.sha }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  },
};
