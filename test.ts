import 'dotenv/config'

try {
  console.log('Loading client...')
  const client = await import('./app/client.js')
  console.log('✓ Client loaded')
} catch (e) {
  console.error('Error loading client:', e)
}

try {
  console.log('Loading mongo client...')
  const mongo = await import('./app/db/mongo.client.js')
  console.log('✓ Mongo client loaded')
} catch (e) {
  console.error('Error loading mongo client:', e)
}

try {
  console.log('Loading listener...')
  const listener = await import('./app/listeners/listener.js')
  console.log('✓ Listener loaded')
} catch (e) {
  console.error('Error loading listener:', e)
}

console.log('All imports successful')
