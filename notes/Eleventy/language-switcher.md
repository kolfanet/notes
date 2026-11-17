# Sources

- [Language switcher for multilingual JAMstack sites](https://www.webstoemp.com/blog/language-switcher-multilingual-jamstack-sites/) 

# Prerequisites

- [internalization (i18n) plugin](/notes/Eleventy/internalization-i18n.md).

# Global data

`/views/_data/site.js`

```js
export default {
    languages: [
      {
        label: "EN",
        code: "en",
      },
      {
        label: "CZ",
        code: "cs",
      },
    ]
  };
```

# Add translationKey to Front Matter Data

`/views/en/notes/introduction.md`

```yaml
---
translationKey: "introPage"
---
```

`/views/cs/notes/introduction.md`

```yaml
---
translationKey: "introPage"
---
```

# Language switcher

`/views/_includes/partials/switcher.njk`

```njk
{# loop though site.languages #}
{% for lgg in site.languages %}

    {# set translatedUrl to the homepage of that language by default #}
    {% set translatedUrl = "/" + lgg.code + "/" %}

    {# loop through all the content of the site #}
    {% for item in collections.all %}

        {# for each item in the loop, check if
        - its translationKey matches the current item translationKey
        - its lang matches the code of the language we are looping through #}
        {% if item.data.translationKey == translationKey and item.data.lang == lgg.code %}
        {% set translatedUrl = item.url %}
        {% endif %}
        
    {% endfor %}

<a href="{{ translatedUrl }}">{{ lgg.label }}</a>

{% endfor %}
```

# Usage

`/views/_layouts/base.njk`

```njk
{% include "partials/switcher.njk" %}
```