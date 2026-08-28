## Summary

Creating [Standard.site](https://standard.site) records in self-hosted PDS from existing 11ty project using [Sequoia](https://sequoia.pub).

## Install Sequoia and log in

```bash
npm i -g sequoia-cli
sequoia
sequoia login
```

## Run init from 11ty project root

```bash
cd your-11ty-project
sequoia init
```

Next steps:

- `Site URL` - https://example.com
- `Content directory` - path to your markdown posts (./views/posts)
- `Cover images directory` - e.g. ./views/assets/images (or leave blank)
- `Public directory` - e.g. ./public
- `Build output directory` - your 11ty output directory, e.g. ./dist
- `URL path prefix for posts` - e.g. /blog or /post
- `Frontmatter field mappings` 
    - title
    - description
    - date
    - cover image
    - tags
    - draft
- `Publication setup` - create a new publication
    - `Publication name` - the name of your blog
    - `Publication description` - a blog's description
    - `Icon image path` - optional path to blog's icon image (./public/icon.png)
    - `Show in discover feed?` - yes/no
    - `Enable automatic Bluesky posting when publishing` - yes/no
    - `Maximum age (in days) for posts to be shared on Bluesky` - e.g. 7

Sequoia will create `sequoia.json`, create a publication record and place `.well-known/site.standard.publication` in your `public` directory.

## addPassthroughCopy for public directory

`eleventy.config.js`:

```bash
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public": "/" });
}
```

## Check your front matter data

```yaml
title: Lorem ipsum
description: My first blog post
date: 2026-04-05
tags:
 - whatever
coverImage: image1.jpg
```

## Test publishing

```bash
sequoia publish --dry-run
```
- Check that it finds the right posts.

## Publish

```bash
sequoia publish
```

- This publishes or updates `site.standard.document` records and stores state in `.sequoia-state.json`.
- Sequoia adds an `atUri` field to each published post’s frontmatter.

## base.njk

```html
<head>
    {% if atUri %}
        <link rel="site.standard.document" href="{{ atUri }}">
    {% endif %}
</head>
```

## Build 11ty

```bash
npm run build
```

Then deploy your site.

## Verify

```text
https://example.com/.well-known/site.standard.publication
```

## Not related - Open Graph

You can align standard.site info with Open Graph:

```html
<head>
    <meta property="og:title" content="{{ title }}">
    <meta property="og:description" content="{{ description }}">
    <meta property="og:image" content="/assets/images/{{ coverImage }}">
    <meta property="og:url" content="{{ page.url }}">
    <meta property="og:type" content="article">
</head>
```






