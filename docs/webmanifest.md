# Guide: Understanding and Writing a `site.webmanifest`

This guide explains what a **Web App Manifest** (`site.webmanifest`) is, what it does, the common fields it contains, best practices, and example usage. Useful links for further reading are included at the end.


## What is `site.webmanifest`?

A **Web App Manifest** is a JSON file that provides metadata about a website or web application.  
It allows your site to behave more like a native app when installed on a user’s device.  
The browser reads this file when the user adds your site to their home screen or installs it as a Progressive Web App (PWA).

It controls
- How your site appears when launched from the home screen
- The splash screen and icon shown
- The default colors and layout
- App-like behavior (hiding browser UI)


## Common Fields Explained

| Field                 | Purpose |
|-----------------------|---------|
| **`name`**            | Full name of the app. Shown on splash screens and in app lists. |
| **`short_name`**       | Short version of the name, used when space is limited (like under the app icon). |
| **`start_url`**        | The URL to load when the app is launched from the home screen. |
| **`display`**          | How your app is displayed: `standalone`, `fullscreen`, `browser`, etc. |
| **`background_color`** | Background of splash screen while loading. |
| **`theme_color`**      | Color of the browser UI (like the address bar) when the app is open. |
| **`icons`**            | Array of app icons in different sizes and formats. |
| **`orientation`**      | Locks the screen orientation (portrait or landscape). Optional. |
| **`scope`**            | Defines the navigation scope of the app. Restricts where the app can go. |
| **`description`**      | Human-readable description of the app. |
| **`lang`**             | Default language of the app. |
| Optional:             | |
| **`categories`**       | Helps browsers categorize your app. |
| **`dir`**              | Text direction (`ltr` or `rtl`). |
| **`display_override`** | Fallback options for display modes if preferred mode isn’t supported. |
| **`prefer_related_applications`** | Points to related native apps. |


## Recommended Best Practices

- Always provide at least:
  - `name` and `short_name`
  - `start_url`
  - `display` (`standalone` is a good default)
  - `background_color` and `theme_color`
  - At least two icons: `192x192` and `512x512`
- Make sure your icons are clear, high-quality, and optimized.
- Match `theme_color` and `background_color` with your site’s branding.
- Keep `start_url` within your site’s scope to avoid navigation issues.
- Test your manifest on real devices and with tools like [Lighthouse](https://developers.google.com/web/tools/lighthouse).


## Example Manifest

```json
{
  "name": "Example Web App",
  "short_name": "Example",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0078d7",
  "description": "An example web app demonstrating use of a webmanifest.",
  "lang": "en",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```


## How to Include in Your HTML

Add this in your `<head>` section:
```html
<link rel="manifest" href="/site.webmanifest" />
```


## Further Reading and Tools

- [MDN: Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Google Developers: Web App Manifest](https://developers.google.com/web/fundamentals/web-app-manifest/)
- [Lighthouse: PWA Audit Tool](https://developers.google.com/web/tools/lighthouse)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Can I Use: Web App Manifest](https://caniuse.com/?search=manifest)


## Notes
- The manifest is just one part of creating a PWA. You also need a service worker and HTTPS for full functionality.
- You can extend the manifest with more fields as your app grows.
