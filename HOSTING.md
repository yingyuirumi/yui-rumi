# Hosting the Yingternet AI Family website

## Recommended first release

Keep the public website on GitHub Pages for the first release, while keeping the AI Family itself on YCloud.

This website is a public, static presentation layer. It contains no Agent runtime, memory, credentials or private API. GitHub Pages provides managed TLS, CDN delivery and isolation from YCloud's private management plane. Using it for public files does not move the family or its data out of YCloud.

### GitHub Pages deployment

1. Keep `yui-rui.yingternet.com` in `CNAME`.
2. In the GitHub repository settings, configure Pages to deploy from `main` at the repository root.
3. At the DNS provider, point the `yui-rui` subdomain CNAME to `yingyuirumi.github.io`.
4. Push the reviewed static source to `main`.
5. After GitHub issues the certificate, enable **Enforce HTTPS**.
6. Verify `/`, `/en.html`, `/privacy.html`, `/tos.html`, the language switch and social links.

Do not store deployment credentials, Agent secrets, private logs or memory files in this repository.

## YCloud sovereign origin

When the public site should also originate from YCloud, use a dedicated unprivileged VM or LXC in a DMZ/server VLAN. Do not serve the files from an Agent VM, a Proxmox host or a storage management interface.

Recommended layout:

```text
/srv/www/yui-rui/
├── releases/
│   └── <git-commit-sha>/
└── current -> releases/<git-commit-sha>/
```

Deploy each Git commit into its own release directory, verify it, then atomically switch the `current` symlink. Rollback becomes a symlink change instead of an in-place overwrite.

### Caddy example

```caddyfile
yui-rui.yingternet.com {
    root * /srv/www/yui-rui/current
    encode zstd gzip

    header {
        X-Content-Type-Options nosniff
        Referrer-Policy strict-origin-when-cross-origin
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
        Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests"
    }

    @assets path /images/* *.css *.js
    header @assets Cache-Control "public, max-age=86400"

    @html path / /index.html /en.html /privacy.html /tos.html
    header @html Cache-Control "public, max-age=300, must-revalidate"

    file_server
}
```

Caddy can manage Let's Encrypt certificates automatically when ports 80 and 443 reach the VM. If Cloudflare is used as the public edge, use **Full (strict)** TLS and an origin certificate or a publicly trusted certificate at the origin.

### Network and operational boundary

- Expose only TCP 80/443 to the web VM; administer it through the trusted network or VPN.
- Keep Proxmox VE, PBS, NAS, SAN, GitLab and Agent management interfaces off the public VLAN.
- Mount no Agent workspace, memory or secrets into the web root.
- Send only minimal access and error logs to the normal security monitoring path.
- Include the repository and web VM in the existing hourly snapshots, daily VM backups, PBS and cross-region recovery policy.
- Test restore and DNS cutover before treating the YCloud origin as production-ready.

## Deployment model after the first release

A practical long-term pattern is:

1. Self-hosted GitLab remains the authoritative operational repository and CI system.
2. A reviewed commit is mirrored to the public GitHub repository for GitHub Pages.
3. The same commit is optionally deployed to the YCloud release directory.
4. DNS selects the active public origin; the other copy remains a warm fallback.

This keeps public delivery replaceable while the identities, memory, data and Agent operations remain anchored in YCloud.
