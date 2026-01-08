import { normalize } from './parser.js'

export function handleSettlement(log: any) {
  const normalized = normalize(log)
  //persist(normalized)
}
