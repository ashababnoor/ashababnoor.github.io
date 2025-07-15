# Favicon & Profile Image — Technical Guide

## Favicon

### Dimensions
- Minimum: `32×32 px`
- Recommended: `64×64 px` or `128×128 px` (for Retina/high-DPI)
- If you want to be fancy: **180×180 px** (also covers iOS home screen icons)
- Must be **square**
- If you want a circle → design it inside a square with transparent corners

### Format
- PNG → good for modern browsers & transparency
- ICO → optional for legacy support (can bundle multiple sizes)
- File size → keep it small (a few KB, ideally <100 KB)

### HTML Snippet
```html
<!-- Standard favicon -->
<link rel="icon" href="assets/favicon.png" type="image/png">

<!-- For Apple devices (optional) -->
<link rel="apple-touch-icon" href="assets/favicon.png">

<!-- For legacy IE (optional) -->
<link rel="shortcut icon" href="assets/favicon.png" type="image/png">
```

### Folder structure example
```
/
├── index.html
├── assets/
│   └── favicon.png
```

---

## Profile Image

### Dimensions
- Display size on site: ~150×150 px
- Save at 2× (Retina screens): ~300×300 px
- If used larger elsewhere, consider up to 500×500 px

### File size
- Target: ~30–70 KB for fast loading

### Format
- Best: WebP (small, sharp)
- Good: JPEG (~75–85% quality)
- PNG only if transparency is needed

---

## Metadata

### ❌ Remove all unnecessary metadata:
- GPS / location data
- Camera/device details
- Timestamps
- Editing software tags

### Keep:
- Color profile (e.g., sRGB) for color accuracy

---

## 🛠️ Tools to optimize and strip metadata

- [Squoosh](https://squoosh.app) — resize, compress, convert  
- [ImageOptim](https://imageoptim.com/mac) — strip metadata, compress (macOS)  
- [TinyPNG](https://tinypng.com) — compress PNG/JPEG online  
- [RealFaviconGenerator](https://realfavicongenerator.net) — generate favicons and all needed HTML  
- CLI (macOS/Linux) exiftool for metadata stripping:  

```bash
brew install exiftool
exiftool -all= your-image.jpg
```

---

## TL;DR Table

|   | Favicon | Profile Image |
|---|---------|----------------|
| Size | ≥64×64 px (square), optionally 180×180 for iOS | ~300×300 px (2× display size) |
| Format | PNG / ICO | WebP / JPEG |
| File size | few KB, ideally <100 KB | ~30–70 KB |
| Shape | Square or circle-in-square PNG | Square or circle |
| Metadata | Strip all unnecessary metadata | Strip all except color profile |
