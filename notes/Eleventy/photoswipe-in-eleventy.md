## Summary

Using PhotoSwipe in 11ty.

## Sources

- [Official website](https://photoswipe.com/getting-started/)

## PhotoSwipe installation

```bash
npm install photoswipe
```

## Copy PhotoSwipe files

`eleventy.config.js`:

```js
export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({
        "node_modules/photoswipe/dist/photoswipe.css": "assets/css/photoswipe.css",
        "node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js": "assets/js/photoswipe-lightbox.esm.min.js",
        "node_modules/photoswipe/dist/photoswipe.esm.min.js": "assets/js/photoswipe.esm.min.js"
    });
}
```

## Add PhotoSwipe CSS

```html
<head>
    <link rel="stylesheet" href="/assets/css/photoswipe.css" />
</head>
```

## Create PhotoSwipe script

`views/assets/js/photoswipe.js`:

```js
import PhotoSwipeLightbox from '/assets/js/photoswipe-lightbox.esm.min.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#my-gallery',
  children: 'a',
  pswpModule: () =>
    import('/assets/js/photoswipe.esm.min.js'),

  bgOpacity: 1, // 0 = transparent, 1 = opaque
});

lightbox.init();
```

## Add script to base.njk

`views/_layouts/base.njk`:

```html
<body>
    <script type="module" src="/assets/js/photoswipe.js"></script>
</body>
```

## Usage

```html
<div class="pswp-gallery" id="my-gallery">
  <a
    href="https://live.staticflickr.com/65535/51357005462_97135e04be_b.jpg"
    data-pswp-width="1024"
    data-pswp-height="766"
    target="_blank"
  >
    <img src="https://live.staticflickr.com/65535/51357005462_97135e04be_m.jpg" alt="Apollo 15" />
  </a>
</div>
```
