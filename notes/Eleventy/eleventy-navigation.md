# Sources

- [Official Documentation](https://www.11ty.dev/docs/plugins/navigation/)

# Installation

```bash
npm install @11ty/eleventy-navigation
```

# Configuration (ESM)

`/eleventy.config.js`

```js
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
};
```

# Front Matter Data

```yaml
---
eleventyNavigation:
  key: Mars                 # unique key of navigation object
  parent: Solar system      # parent navigation object
  order: 2                  # defines the order in which objects are returned
  excerpt: Solar system bodies.       # description of navigation object
  title: Solar System Bodies          # title displayed (otherwise key is used)
  url: https://www.google.com/        # used to link to external URL
permalink: false           # to prevent a file creation in Eleventy output site
---
```

# Usage - navigation (Nunjucks)

```njk
{# returns all pages across all collections #}
{% set navPages = collections.all | eleventyNavigation %}

{# returns pages for single branch (Mars) in specific collection (Planets) #}
{% set navPages = collections.planets | eleventyNavigation("Mars") %}
```
 
# Usage - breadcrumb trail (Nunjucks)

```njk
{# returns breadcrumb trail for specific navigation key (Mars) #}
{% set navPages = collections.all | eleventyNavigationBreadcrumb("Mars") %}

{# returns breadcrumb trail for specific navigation key ("Mars") and include the key as well #}
{% set navPages = collections.all | eleventyNavigationBreadcrumb("Mars", { includeSelf: true }) %}

{# returns breadcrumb trail for current page #}
{% set navPages = collections.all | eleventyNavigationBreadcrumb(eleventyNavigation.key) %}
```