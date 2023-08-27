exports[`Session config > Update session config 1`] = `"import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'
import { defineConfig } from \\"@adonisjs/session\\";

const sessionConfig = defineConfig({
  enabled: true,
  driver: Env.get('SESSION_DRIVER'),
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: '2h',
  cookie: {
    path: '/',
    httpOnly: true,
    sameSite: false,
  },
  file: {
    location: Application.tmpPath('sessions'),
  },
  redisConnection: 'local',
})

export default sessionConfig
"`

