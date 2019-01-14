---
layout: default
title: Home
herokulink: https://herokucontainer
---

The **RCF Shop API**  can be used to query items from a warehouse based on name and availablility. The *film* query is an addition built early in the project.

### Query
`{{ page.herokulink }}/query` can be used to find single films.

Parameter **name** can be filled with a partial film name. For instance, `name=Casa`, supplied as `{{ page.herokulink }}/query?name=Casa` will return `{"title":"Casanova","price":63,"inventory_count":"0"}`. Queries made without the `all` flag will return the first similar result.

Parameter **instock** can be used to only return films in our inventory. `{{ page.herokulink }}/query?name=Casa&instock` will return `{}`. Optionally, `true` and `false` arguments can be supplied to the instock parameter. `{{ page.herokulink }}/query?name=Casa&instock=false` will return `{"title":"Casanova","price":63,"inventory_count":"0"}`.

**Examples**

To return all out-of-stock films with *and* in the name, query `/query?name=And&instock=false&all`

The result will appear something like:

```json
[
  {
    "title": "Cat and the Canary, The",
    "price": 16,
    "inventory_count": "0"
  },
  {
    "title": "Male and Female",
    "price": 27,
    "inventory_count": "0"
  },
  {
    "title": "Tortoise and the Hare, The",
    "price": 42,
    "inventory_count": "0"
  },
  {
    "title": "Fast & Furious (Fast and the Furious 4, The)",
    "price": 34,
    "inventory_count": "0"
  },
]
```

### Film

`{{ page.herokulink }}/film/film name`