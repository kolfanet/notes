# Summary

Using i18n plugin in 11ty site.

# Sources

- [Official Documentation](https://www.11ty.dev/docs/plugins/i18n/)
- [Multilingual sites with Eleventy](https://www.webstoemp.com/blog/multilingual-sites-eleventy/)

# Instalation

Plugin is bundled with Eleventy and does not require separate installation. 

 
# Configuration (ESM)

`/eleventy.config.js`

```js
import { I18nPlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage: "en",
  });
}
```

# Folder structure

```txt
└── views                        
     ├── _data                
     ├── _includes             
     │    └── partials           
     ├── _layouts              
     ├── assets                
     │    ├── css             
     │    ├── img             
     │    └── js              
     ├── en                 
     │    ├── notes          // custom folder for EN content
     │    ├── posts          // custom folder for EN content
     │    ├── index.md      // index file for EN content
     │    └── en.json       // default Front Matter Data for EN markdown files
     └── cs                 
         ├── notes          // custom folder for CS content
         ├── posts          // custom folder for CS content 
         ├── index.md      // index file for CS content
         └── cs.json       // default Front Matter Data for CS markdown files
```

# Front Matter Data

`/views/en/en.json`

```json
{
  "lang": "en"
  }
```

`/views/cs/cs.json`

```json
 {
  "lang": "cs"
  }
```

# Base layout

`/views/_layouts/base.njk`

```html
<!DOCTYPE html>
<html lang="{{ lang }}">
  <head>
    ...
```

# Localized collections (example)

`/eleventy.config.js`

```js

export default function(eleventyConfig) {
	
  // collection of posts in english
  eleventyConfig.addCollection("posts_en", function (collection) {
    return collection.getFilteredByGlob("views/en/posts/*.md");
  });

  // collection of posts in czech
  eleventyConfig.addCollection("posts_cs", function (collection) {
    return collection.getFilteredByGlob("views/cs/posts/*.md");
  });

};
```

## Usage of localized collections

### List of posts

```html
{% for item in collections["posts_" + lang ] | reverse %}
<a href="{{ item.url }}">{{ item.data.title }}</a>
{% endfor %}
```

### List of posts - Eleventy Navigation

```html
{% set navPages = collections["posts_" + lang] | eleventyNavigation("Notes") %}
<ul>
{%- for entry in navPages %}
  <li>
    <a href="{{ entry.url }}">{{ entry.title }}</a>
  </li>
{%- endfor %}
</ul>
```

# Dictionary (ESM)

`/views/_data/languages.js`

```js
export default {
  en: {
    nextPostText: 'Next',
    previousPostText: 'Previous'
  },
  
  cs: {
    nextPostText: 'Následující',
    previousPostText: 'Předchozí'
  }
};
```

## Accessing dictionary

### Using "lang" variable

```njk
{{ languages[lang].nextPostText }}
```

### Using language directly

```njk
{{ languages.en.nextPostText }}
```

# Redirections

## Netlify

`/netlify.toml`

```html
# Redirect for end-user’s browser preference override
[[redirects]]
  from = "/*"
  to = "/en/:splat"
  status = 302
  conditions = {Language = ["en"]}

# Default
[[redirects]]
  from = "/*"
  to = "/cs/:splat"
  status = 302
```

## Cloudflare Pages

`functions/index.js`:

```js

export function onRequest({ request }) {
  const acceptLanguage =
    request.headers.get("Accept-Language") || "";

  // Parse language preferences and their quality weights
  const languages = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tag, quality] = entry.trim().split(";q=");

      return {
        tag: tag.toLowerCase(),
        q: quality === undefined ? 1 : Number(quality),
      };
    })
    .filter(({ tag, q }) => tag && q > 0 && q <= 1)
    .sort((a, b) => b.q - a.q);

  // Default to English
  let lang = "en";

  for (const { tag } of languages) {
    const primary = tag.split("-")[0];

    if (primary === "cs" || primary === "en") {
      lang = primary;
      break;
    }
  }

  const url = new URL(request.url);
  url.pathname = `/${lang}/`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      Vary: "Accept-Language",
      "Cache-Control": "private, no-store",
    },
  });
}
```

