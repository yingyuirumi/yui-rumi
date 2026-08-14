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
4. Commit the reviewed website source on `main`.
5. Create an annotated `site-vYYYY.MM.DD.N` tag on that commit.
6. Push `main` and the exact release tag without force.
7. Wait for GitHub Pages to publish from `main` at the repository root.
8. Smoke-test the live site and record the successful tag as the current production version.

## Rollback

Do not reset or force-push the shared `main` branch.

1. Identify the last known-good `site-v...` tag.
2. Compare that tag with the current production commit.
3. Revert the faulty release commit or commits on `main`, preserving a visible audit trail.
4. Review and test the resulting tree.
5. Commit the rollback, create a new annotated release tag, then push `main` and the new tag.
6. Verify the live site after GitHub Pages republishes it.

The old tag remains immutable evidence of what was deployed; the new tag identifies the restored production state.
