import fs from 'node:fs'

import itemTypes from './item-types.json'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const write = (name: string, type: string, ids: Map<unknown, unknown>) => {
  const data = JSON.stringify([...ids.values()])
  fs.mkdirSync('../../data/name', { recursive: true })
  fs.mkdirSync('../../data/type', { recursive: true })
  fs.writeFileSync(`../../data/name/${name}.json`, data)
  fs.writeFileSync(`../../data/type/${type}.json`, data)
  fs.writeFileSync(`../../data/${name}-${type}.json`, data)
}

const listApi = (type: string, page = 1, now = Date.now()) =>
  `https://proxy.viki.moe/api/market/goods?proxy-host=buff.163.com&game=csgo&page_num=${page}&category=${type}&sort_by=price.desc&use_suggestion=0&tab=selling&_=${now}`

const cookie = process.env.BUFF_COOKIE || fs.readFileSync('./cookie.txt', 'utf-8').trim()

const fetchTypeDetail = async (type: string, page: number) => {
  const res = await (await fetch(listApi(type, page), { headers: { cookie } })).json()
  return ((res || {}) as any).data || {}
}

for (const { name, type } of itemTypes) {
  const ids = new Map()
  const addItems = (items: any[] = []) => {
    for (const item of items) {
      item.type = type
      item.common_name = name
      ids.set(item.id, item)
    }
  }
  const { items = [], total_count, total_page = 1 } = await fetchTypeDetail(type, 1)
  addItems(items)
  log(name, 1, total_page, ids, total_count)
  await wait(random(800, 2400))
  for (let page = 2; page <= total_page; page++) {
    const { items = [] } = await fetchTypeDetail(type, page)
    addItems(items)
    log(name, page, total_page, ids, total_count)
    await wait(random(800, 2400))
  }
  write(name, type, ids)
  console.log(`[${name}] done, total ${ids.size} items`)
}

function log(name: string, page: number, total_page: number, ids: any, total_count: number) {
  const pageLength = total_page.toString().length
  const countLength = total_count.toString().length
  const size = ids.size.toString().padStart(countLength, '0')
  const pageCount = page.toString().padStart(pageLength, '0')

  console.log(`[${name}] [${pageCount}/${total_page}] ${size}/${total_count} items fetched`)
}
