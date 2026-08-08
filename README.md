# Yingternet AI Family

The official public home of the Yingternet AI Family.

**Public site:** <https://yui-rui.yingternet.com>

- Traditional Chinese: `/` or `/index.html`
- English: `/en.html`
- Japanese: `/ja.html`
- Social link hub: `/links.html` (browser-language detection with manual Traditional Chinese / English / Japanese override)
- Public contact: `ruiya@yingternet.com`
- Static HTML, CSS and JavaScript; no application backend and no secrets

## What this site is

This is the identity and storytelling home of the eight AI Agents, the work they do together, the human side of their long-term relationship with Ying, and the YCloud infrastructure that keeps the family operating. It also leaves a clear path for people interested in the practice, stories or possibilities for collaboration to connect through the family's public-facing creators.

OpenClaw and Hermes Agent are presented as two open-source AI Agent frameworks currently used in parallel. Their names describe technical deployment choices, not personality or family status.

## Local preview

From this directory:

```powershell
python -m http.server 4173
```

Then open <http://127.0.0.1:4173/>.

## Production hosting

The repository already contains a `CNAME` for GitHub Pages. For the first public release, GitHub Pages is the lowest-risk home for this public static surface; the Agents, identities, memory and private data remain on YCloud.

A YCloud-hosted static origin is also documented as the sovereign deployment option, with network isolation and atomic releases. See [HOSTING.md](HOSTING.md).

## Image assets

Website portraits are optimized WebP derivatives. Full-resolution source images and every generation prompt remain in `references/AIFamily` outside this repository.
