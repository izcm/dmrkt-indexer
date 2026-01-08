import 'dotenv/config'

import './listeners/listener.js'
import { start } from './server.js'

await start()
