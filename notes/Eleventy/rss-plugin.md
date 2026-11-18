# Sources

- [Official Documentation](https://www.11ty.dev/docs/plugins/rss/)

# Installation

```bash
npm install @11ty/eleventy-plugin-rss
```
 
# Configuration (ESM)

`/eleventy.config.js`

```js
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed.xml",
		collection: {
			name: "posts", // iterate over `collections.posts`
			limit: 10,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "Blog Title",
			subtitle: "This is a longer description about your blog.",
			base: "https://example.com/",
			author: {
				name: "Your Name",
				email: "", // Optional
			}
		}
	});
};
```

# Adjust base layout

`/views/_layouts/base.njk`

```html
  <head>
	<link rel="alternate" type="application/rss+xml" title="Your Site Title" href="https://yourwebsite.com/feed.xml" />
  </head>
```

