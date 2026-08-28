## Summary

Creating a new 11ty project.

**Prerequisites:**

- [Node.js installation](/notes/Installation-Guides/nodejs-installation.md)

## Create package.json

```bash
npm init -y
```

## Use ES Modules (ESM)

```bash
npm pkg set type="module"
```

## Install Eleventy

```bash
npm install @11ty/eleventy
```

## Create index file

```bash
echo '# My Eleventy Project' > index.md
```

## Create .gitignore

`~/.gitignore`

```text
# Dependencies
node_modules

# Eleventy output
dist

# VS Code
.history
.vscode

# Environment Variables
.env

# Mac OS
.DS_Store

# Obsidian
.obsidian
```

## Create eleventy.config.js

`~/eleventy.config.js`

```js
export default function(eleventyConfig) {
    // Configure Eleventy
};
```

## Modify scripts

`~/package.json`

```json
"scripts": {
    "start": "eleventy --serve",
    "build": "eleventy"
}
```

## Define default directories

`~/eleventy.config.js`

```js
export default function(eleventyConfig) {
    // Configure Eleventy
};

export const config = {
    dir: {
        input: "views",
        layouts: "_layouts",
        output: "dist"
    }
};
```

## Define default template engine

`~/eleventy.config.js`

```js
export default function(eleventyConfig) {
    // Configure Eleventy
};

export const config = {

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    
    dir: {
        input: "views",
        layouts: "_layouts",
        output: "dist"
    }
};
```

## Create directories (example)

```text
├── views
│ ├── _data
│ │ └── site.js
│ ├── _includes
│ │ └── partials
│ ├── _layouts
│ │ └── base.njk
│ ├── assets
│ │ ├── css
│ │ ├── img
│ │ └── js
│ ├── note
│ │ └── note.json
│ ├── post
│ │ └── post.json
│ └── index.md
├── eleventy.config.js
├── .gitignore
├── package.json
└── package-lock.json
```

## addPassthroughCopy

`~/eleventy.config.js`

```js
export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("views/assets/css");
    eleventyConfig.addPassthroughCopy("views/assets/img");
    eleventyConfig.addPassthroughCopy("views/assets/js");
};

export const config = {

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    
    dir: {
        input: "views",
        layouts: "_layouts",
        output: "dist"
    }
};
```

## Create basic layout

`~/views/_layouts/base.njk`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ title }}</title>
  </head>
  <body>
    <main>
      {% block content %}
      {{ content | safe }}
      {% endblock %}
    </main>
  </body>
</html>
```

## Define default Front Matter Data (optional)

`~/views/note/note.json`

```json
{
    "layout": "base"
}
```

## Add CSS stylesheet

`~/views/_layouts/base.njk`

```html
<head>
  <link href="/assets/css/style.css" rel="stylesheet">
</head>
```

## Define permalinks (optional)

```yaml
---
permalink: "/index.html"
---
```

```yaml
---
permalink: "/{{ page.fileSlug }}/"
---
```