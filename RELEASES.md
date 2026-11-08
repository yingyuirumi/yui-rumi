# Website releases and rollback

The public website is deployed from the reviewed `main` branch. Every production release must point to one exact commit and one annotated Git tag.

## Version format

Use annotated tags in this form:

```text
site-vYYYY.MM.DD.N
```

`N` starts at `1` and increments when more than one website release is published on the same day. Example: `site-v2026.08.11.1`.

The tag message should include:

- the public URL;
- a short summary of the website change;
- the previous production tag;
- confirmation that `CNAME` remains `yui-rui.yingternet.com`.

## Release checklist

1. Confirm the worktree and preserve unrelated or untracked user files.
2. Review the complete diff, especially `CNAME`, `privacy.html`, `tos.html`, public images and social links.
3. Verify Traditional Chinese, Simplified Chinese, English and Japanese home pages and Field Notes remain synchronized; then check mobile navigation, image zoom, links hub and contact address.
4. Update the footer `Last updated` date, including its `<time datetime="...">` attribute, on every page that carries the shared footer. A stale date is worse than none, so this is not optional. On the four homepages, also update the `.hero-update` label (date, its `<time datetime>`, the latest Field Note number, and the `#note-NNN` link) so it always names the newest release. Each homepage carries it **twice** with identical content: `.hero-update-photo` (desktop, on the photo's top-left corner) and `.hero-update-top` (≤1000px, under the header). Change both. When a release adds a Field Note, also point the four `field-notes*.html` share tags (`og:title`, `og:description`, `og:image` with its width/height, `og:url`) at the new note, using a 1200×630 JPEG share image. Otherwise every shared Field Notes link previews an older note; Notes 003 and 004 both shipped with Note 002's preview.
5. If `styles.css` or `script.js` changed, bump their `?v=` cache-buster on every page that loads them. Otherwise returning visitors keep the cached old asset.
6. Commit the reviewed website source on `main`.
7. Create an annotated `site-vYYYY.MM.DD.N` tag on that commit.
8. Push `main` and the exact release tag without force.
9. Wait for GitHub Pages to publish from `main` at the repository root.
10. Smoke-test the live site and record the successful tag as the current production version.

## Rollback

Do not reset or force-push the shared `main` branch.

1. Identify the last known-good `site-v...` tag.
2. Compare that tag with the current production commit.
3. Revert the faulty release commit or commits on `main`, preserving a visible audit trail.
4. Review and test the resulting tree.
5. Commit the rollback, create a new annotated release tag, then push `main` and the new tag.
6. Verify the live site after GitHub Pages republishes it.

The old tag remains immutable evidence of what was deployed; the new tag identifies the restored production state.
