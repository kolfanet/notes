# Sources

- [Official Documentation](https://www.11ty.dev/docs/plugins/syntaxhighlight/)

# Installation

```bash
npm install @11ty/eleventy-plugin-syntaxhighlight
```

# Configuration (ESM)

`/eleventy.config.js`

```js
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);
};
```

# CSS stylesheet

`/views/assets/css/code.css`

```html
<!DOCTYPE html>
<html lang="{{ lang }}">
  <head>
    ...  
    <link href="/assets/css/code.css" rel="stylesheet">
    ...
  </head>
  <body>
   ...
  </body>
</html>
```
Repository with [CSS files](https://github.com/PrismJS/prism-themes) that can be used as `code.css`. 

# addPassthroughCopy for CSS stylesheet

`/eleventy.config.js`

```js
eleventyConfig.addPassthroughCopy("views/assets/css/code.css");
```

# Template engine override

```yaml
---
templateEngineOverride: md
---
```

# Usage (Markdown)

Triple backtick indicates the start/end of the code section. Language must be specified after the first triple backtick.

