---
layout: default
title: Home
herokulink: https://rcf-shopify-s19.herokuapp.com
---

The **RCF Shop API**  can be used to query items from a warehouse based on name and availablility. 

The API is currently live at [rcf-shopify-s19.herokuapp.com](https://rcf-shopify-s19.herokuapp.com/)

### Product Queries

`{{ page.herokulink }}/query` can be used to find single items.

Parameter **name** can be filled with a partial item name. For instance, `name=Casa`, supplied as `{{ page.herokulink }}/query?name=Casa` will return `{"title":"Casanova","price":63,"inventory_count":"0"}`. Queries made without the `all` flag will return the first similar result.

Parameter **instock** can be used to only return items in our inventory. `{{ page.herokulink }}/query?name=Casa&instock` will return `{}`. Optionally, `true` and `false` arguments can be supplied to the instock parameter. `{{ page.herokulink }}/query?name=Casa&instock=false` will return `{"title":"Casanova","price":63,"inventory_count":"0"}`.

**Examples**

To return all out-of-stock items with *and* in the name, query `/query?name=And&instock=false&all`

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

### Purchase

To purchase a product, first query an item, then POST use the full name as the name parameter to `/purchase`.

First, find an item using `query` or `all`.

Ex. `{{ page.herokulink }}/query?name=alie`

```json
{
    "title": "Alien Abduction",
    "price": 37,
    "inventory_count": "469"
}
```

If a item is out of stock, the user will be presented with this message:

`{{ page.herokulink }}/purchase?name=Ghost%20in%20the%20Machine`

```json
{
    "error":"Out of stock.",
    "message":"The item Ghost in the Machine (a.k.a. Deadly Terror) 
        is out of stock! Please check back soon."
}
```

If an item is in stock, the following message will be shown:


```json
{
    "message": "The film 'Alien Abduction' is available (469 in stock), but was not purchased. Use the flag &process=true to complete the transaction."
}
```

The item can then be purchased by appending `&process=true`.

Ex. `http://localhost:3000/purchase?name=Alien Abduction&process=true`

```json
{
    "message": "The film 'Alien Abduction' was purchased. Inventory now at 468."
}
```

Querying *Alien Abduction* shows that the `inventory_count` has been reduced by one.

```json
{
    "title": "Alien Abduction",
    "price": 37,
    "inventory_count": "469"
}
```
