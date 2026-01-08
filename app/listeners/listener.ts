import { parseAbi } from 'viem'

import { publicClient as client } from '../client.js'
import { handleSettlement } from './settlement/handler.js'

const target = '0xc80F9dA34212736BE29fcF9eD26B5951DDcc62Bb'

export const unwatch = client.watchEvent({
  address: target,
  events: parseAbi([
    'event Settlement(bytes32 indexed orderHash, address indexed collection, uint256 indexed tokenId, address seller, address buyer, address currency, uint256 price)',
  ]),
  onLogs: logs => {
    console.log(logs)
    logs.forEach(routeLog)
  },
  onError: error => console.log(error),
})

const routeLog = (log: any) => {
  switch (log.eventName) {
    case 'Settlement': {
      handleSettlement(log)
    }
  }
  console.log(log)
}

console.log(`watching ${target}!`)

const dummyEvent = {
  eventName: 'Settlement',
  args: {
    orderHash: '0x7ed21442f67de136716feb3ca9b1fe680533610cf855622550ae517c1adf237b',
    collection: '0x2E10a0A6383a084cc7449fe58D40D3702A8E57F4',
    tokenId: 18n,
    seller: '0x97BE8FF9065cE5F3d562CB6b458cdE88c8307Edf',
    buyer: '0xdA89B1B5835290DA6cF1085E1f02D8600074E35D',
    currency: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    price: 450000000000000000n,
  },
  address: '0xc80f9da34212736be29fcf9ed26b5951ddcc62bb',
  topics: [
    '0xc0ac3eb1e8caef05b202043f34de8e3173fab712167584f7a2a9f4c302bd0e9c',
    '0x7ed21442f67de136716feb3ca9b1fe680533610cf855622550ae517c1adf237b',
    '0x0000000000000000000000002e10a0a6383a084cc7449fe58d40d3702a8e57f4',
    '0x0000000000000000000000000000000000000000000000000000000000000012',
  ],
  data: '0x00000000000000000000000097be8ff9065ce5f3d562cb6b458cde88c8307edf000000000000000000000000da89b1b5835290da6cf1085e1f02d8600074e35d000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000063eb89da4ed0000',
  blockHash: '0xfa97d7f79ef540de1c2a32723c093bee8207621cbbad9557494fb260659434ee',
  blockNumber: 23985805n,
  blockTimestamp: 1765620831n,
  transactionHash: '0x05c12fc9a1b86444fca7ec814c71c78540d04adef74c8f79278ee50574e5dc2c',
  transactionIndex: 0,
  logIndex: 3,
  removed: false,
}
