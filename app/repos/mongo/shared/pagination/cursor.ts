import { ObjectId } from 'mongodb'
import { MongoSortDir as CursorDir, CursorPageCore } from './types.js'

export const toMongo = (dir: 'asc' | 'desc'): 1 | -1 => (dir === 'asc' ? 1 : -1)

export const walkPath = (obj: any, path: string) => {
  if (!obj || Object.keys(obj).length === 0) return undefined

  return path.split('.').reduce((curr, k) => {
    if (curr == null) return undefined
    return curr[k]
  }, obj)
}

export const cursorTag = (value: string | number): 's' | 'n' =>
  typeof value === 'string' ? 's' : 'n'

export const encodeCursor = (value: string | number, id: ObjectId) =>
  `${cursorTag(value)}${value}_${id.toString()}`

export const buildSortSpec = (field: string, dir: CursorDir) => ({
  [field]: dir,
  _id: dir,
})

export function buildCursorFilter({
  sortField: field,
  sortDir: dir,
  cursor,
}: Omit<CursorPageCore, 'limit'>) {
  if (!cursor) return null

  const tag = cursor[0]
  const [rawVal, rawId] = cursor.slice(1).split('_')
  const value = tag === 's' ? rawVal : Number(rawVal)
  const id = new ObjectId(rawId)

  const cmp = dir === 1 ? '$gt' : '$lt'

  return {
    $or: [{ [field]: { [cmp]: value } }, { [field]: value, _id: { [cmp]: id } }],
  }
}
