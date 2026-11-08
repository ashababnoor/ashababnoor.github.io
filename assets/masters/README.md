# Masters

Full-resolution sources. Nothing on the site links to these. Re-export served
files from them, never from another served copy.

Anything linked from HTML lives directly under `assets/` (favicons under
`assets/favicons/`). Anything not linked lives here. Keep only the current
served version; older ones can be regenerated from their master.

Tools used (macOS): `sips` (built in), `cwebp` and `rsvg-convert`
(`brew install webp librsvg`). Run every command from the repo root.

## Profile photo

Served file: `assets/shabab-v3.webp`, 1000x1000, WebP quality 100.

```bash
cwebp -quiet -q 100 -m 6 -resize 1000 1000 \
  assets/masters/profile/shabab-v3.png -o assets/shabab-v3.webp
```

| Version | Master | Notes |
|---|---|---|
| v1 | `profile/shabab-v1.jpg` (1370px) | 2024 photo. The old site copy was 500px. |
| v2 | `profile/shabab-v2.png` (940px) | Blue backdrop. The old site copy was 875px. |
| v3 | `profile/shabab-v3.png` (2000px) | Warm stone background with wave lines. |

A master can be shrunk but not usefully enlarged, so the pixel size above is
the ceiling for each version. To serve an older version, use the same command
with its master and a new versioned output name, then update the HTML.

## OG banner

Served file: `assets/og-banner-v3.jpg`, 1200x630, JPEG quality 90. Masters are
2400x1260 (`og-banner-v2-square.png` is 1500x1500).

```bash
sips -s format jpeg -s formatOptions 90 -z 630 1200 \
  assets/masters/og/og-banner-v3.png --out assets/og-banner-v3.jpg
```

For a new version, export the design as `og-banner-vN.png` into `og/`, run the
command with `vN`, and update `og:image`, `og:image:secure_url` and
`twitter:image` in `index.html`. Use a new filename each time, because social
platforms cache `og:image` by URL.

The square master (`og-banner-v2-square.png`) has no served copy. Make one with
`-z 1200 1200` if it is ever needed.

## Favicons

There is no separate master. `assets/favicons/v2/favicon.svg` is the source
(the letters are outlines taken from JetBrains Mono ExtraBold). The PNGs are
renders of it.

```bash
for w in 32 48 72 96 128 192 512; do
  rsvg-convert -w $w -h $w assets/favicons/v2/favicon.svg \
    -o assets/favicons/v2/favicon-${w}x${w}.png
done

# apple-touch icon: same SVG with square corners (iOS rounds them itself)
sed 's/ rx="112"//' assets/favicons/v2/favicon.svg \
  | rsvg-convert -w 180 -h 180 -o assets/favicons/v2/apple-touch-icon.png
```
