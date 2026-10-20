// Utils (explicit .js so `npm test` can run this file in Node)
import { normalizeProductId } from './productIds.js'


// Season a date falls in: the last season whose start (month/day) is
// on or before it. Before Mar 21, it's still the summer that started
// the previous December.
export function getSeason(seasons, date = new Date()) {
  const today = (date.getMonth() + 1) * 100 + date.getDate()

  const byStart = [...seasons].sort(
    (a, b) =>
      (a.starts.month * 100 + a.starts.day) -
      (b.starts.month * 100 + b.starts.day)
  )

  const current = byStart
    .filter(season => season.starts.month * 100 + season.starts.day <= today)
    .at(-1)

  return current ?? byStart.at(-1)
}


// Product ids in season, for one season.
export function getSeasonalProductIds(season, foodProducts) {
  const ids = new Set()

  for (const foods of Object.values(season.foods)) {
    for (const food of foods) {
      for (const name of foodProducts[food] ?? []) {
        ids.add(normalizeProductId(name))
      }
    }
  }

  return ids
}
