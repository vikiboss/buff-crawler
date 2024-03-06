# Buff Crawler

A simple [Buff](https://buff.163.com) crawler.

## Data

All data are stored in `data` folder, all the following three collections are in the same format:

- `data/name/*.json`, files are named by item name.
- `data/type/*.json`, files are named by item type.
- `data/${name}-${type}.json`, files are named by item name and type.

## Tip

Run following command in DevTools to fetch all types of items on [Buff](https://buff.163.com) market page.

```js
const list = [...document.querySelector('.market-header').querySelectorAll('li')]

const types = list.map(e => ({
  name: e.innerText,
  type: e.getAttribute('value'),
}))

console.log(JSON.stringify(types))
```
