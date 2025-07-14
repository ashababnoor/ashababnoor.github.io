# Build Instructions

Follow these steps to compile your SCSS into CSS:

1. Initialize npm (if you haven’t already):
```bash
npm init -y
```

2. Install Dart Sass as a dev dependency:
```bash
npm install --save-dev sass
```

3. Update your `package.json` with build/watch scripts under `scripts`:
```json
"scripts": {
  "build:css": "sass scss/style.scss style.css --no-source-map",
  "watch:css": "sass --watch scss/style.scss:style.css"
}
```

4. Compile once:
```bash
npm run build:css
```

5. Watch for changes during development:
```bash
npm run watch:css
```