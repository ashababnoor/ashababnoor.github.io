# Guide: `robots.txt` and `humans.txt`

This guide explains how to use `robots.txt` and `humans.txt` files on your website.

---

## `robots.txt`

The `robots.txt` file gives instructions to web crawlers (bots) about which parts of your site they are allowed or disallowed to crawl.

### Where to place it
At the root of your website:
```
https://yourdomain.com/robots.txt
```

### Why use it
- Control which pages or directories search engines index
- Reduce server load by limiting what bots crawl
- Point bots to your sitemap for better indexing

### Basic syntax
A `robots.txt` file consists of one or more rules:
```txt
User-agent: [name of bot or * for all]
Allow: [path you want to allow]
Disallow: [path you want to block]
Crawl-delay: [seconds to wait between requests]
Sitemap: [URL of your sitemap]
```

### Example
```txt
# Allow all bots to crawl everything
User-agent: *
Allow: /

# Point bots to the sitemap
Sitemap: https://yourdomain.com/sitemap.xml

# Ask bots to wait 1 second between requests
Crawl-delay: 1

# Disallow crawling certain folders
Disallow: /assets/temp/
Disallow: /scss/
Disallow: /info/
```

### Explanation of directives
| Directive | Meaning |
|-----------|---------|
| `User-agent: *` | Applies to all bots |
| `Allow: /` | Allow everything (optional if nothing is disallowed) |
| `Disallow: /path/` | Prevent bots from accessing `/path/` |
| `Crawl-delay: 1` | Wait 1 second between requests |
| `Sitemap:` | URL to your sitemap |

### Learn more
- [robots.txt documentation](https://www.robotstxt.org/)

---

## `humans.txt`

The `humans.txt` file is a simple, informal way to credit the people who built your site.  
It has no effect on SEO or bots — it’s just for humans to read.

### Where to place it
At the root of your website:
```
https://yourdomain.com/humans.txt
```

### Why use it
- Show appreciation to your team
- Share contact info or project details
- Leave a personal or friendly note for visitors

### Example
```txt
/* TEAM */
Developer: Ahmed Shabab Noor
Designer: Jane Doe
Contact: shabab@example.com
Site: https://yourdomain.com

/* THANKS */
To all contributors and users

/* TECHNOLOGY */
Built with: HTML, CSS, JS
Hosted on: GitHub Pages
```

### Notes
- The format is flexible — there’s no strict standard
- Use comments (`/* … */`) to organize sections if you like
- Keep it simple and clear

### Learn more
- [humans.txt project](http://humanstxt.org/)

---

## Summary Table
| File | Purpose | URL |
|------|---------|-----|
| `robots.txt` | Controls bots and crawling | `/robots.txt` |
| `humans.txt` | Credits and messages to humans | `/humans.txt` |

Both files can be used together on your site — one for bots, one for people.
